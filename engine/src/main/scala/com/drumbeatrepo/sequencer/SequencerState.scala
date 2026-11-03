package com.drumbeatrepo.sequencer

import cats.effect.IO
import com.drumbeatrepo.domain.MidiDrumType
import com.drumbeatrepo.library.Beat
import org.scalajs.dom.Fetch
import io.circe.Decoder
import io.circe.parser.decode
import io.circe.generic.semiauto.deriveDecoder
import io.circe.generic.auto.deriveDecoder

import scala.concurrent.ExecutionContext.Implicits.global

final case class SequencerState(
    genre: String,
    beat: String,
    tracks: List[Track],
    tempo: Int,
    beatsPerBar: Int,
    subdivisionsPerBeat: Int,
    numberOfBar: Int,
    history: List[SequencerState],
    future: List[SequencerState]
):
  def dispatch(command: Command): IO[SequencerState] =
    command match
      case Command.SelectBeat(newFilename) => {
        for
          response <- IO.fromFuture(
            IO(Fetch.fetch(s"/assets/beats/${newFilename}.json").toFuture)
          )
          text <- IO.fromFuture(IO(response.text().toFuture))
          beat <- IO.fromEither(decode[Beat](text))
        yield SequencerState(
          beat.genre,
          beat.label,
          beat.tracks.map(x =>
            Track(
              x.name,
              x.filename,
              x.midiNote,
              x.steps
                .toCharArray()
                .map(c => if c == 'X' then Velocity.Normal else Velocity.None)
                .toList,
              x.isMuted.getOrElse(false),
              x.isSolo.getOrElse(false)
            )
          ),
          beat.bpm,
          beat.beatsPerBar,
          beat.subdivisionsPerBeat,
          beat.numberOfBar,
          history :+ this,
          Nil
        )
      }

      case Command.ToggleStep(trackName, stepIndex) =>
        tracks.find(_.name == trackName) match
          case None =>
            IO.pure(this)

          case Some(track) =>
            if stepIndex < 0 || stepIndex >= track.steps.length then
              IO.pure(this)
            else
              val newTracks = tracks.map { t =>
                if t.name == trackName then
                  t.copy(
                    steps = t.steps.updated(
                      stepIndex,
                      Velocity.invert(t.steps(stepIndex))
                    )
                  )
                else t
              }

              IO.pure(
                copy(
                  tracks = newTracks,
                  history = history :+ this,
                  future = Nil
                )
              )

      case Command.SetSteps(trackName, fromStepIndex, toStepIndex, velocity) =>
        if fromStepIndex < 0 || toStepIndex < fromStepIndex then IO.pure(this)
        else
          val newTracks = tracks.map { t =>
            if t.name == trackName then
              if toStepIndex >= t.steps.length then t
              else
                t.copy(
                  steps = t.steps.zipWithIndex.map {
                    case (_, i) if i >= fromStepIndex && i <= toStepIndex =>
                      velocity
                    case (step, _) => step
                  }
                )
            else t
          }

          if newTracks == tracks then IO.pure(this)
          else
            IO.pure(
              copy(
                tracks = newTracks,
                history = history :+ this,
                future = Nil
              )
            )

      case Command.SetTempo(newTempo) =>
        history match
          case _ :+ last if last.genre == genre && last.beat == beat =>
            IO.pure(
              SequencerState(
                genre,
                beat,
                tracks,
                newTempo,
                beatsPerBar,
                subdivisionsPerBeat,
                numberOfBar,
                history,
                future = Nil
              )
            )

          case _ =>
            IO.pure(
              SequencerState(
                genre,
                beat,
                tracks,
                newTempo,
                beatsPerBar,
                subdivisionsPerBeat,
                numberOfBar,
                history :+ this,
                future = Nil
              )
            )

      case Command.AddTrack(track) =>
        IO.pure(
          copy(
            tracks = tracks :+ track,
            history = history :+ this,
            future = Nil
          )
        )

      case Command.Undo =>
        history match
          case init :+ last =>
            IO.pure(last.copy(history = init, future = this :: future))
          case _ =>
            IO.pure(this)

      case Command.Redo =>
        future match
          case Nil =>
            IO.pure(this)
          case next :: rest =>
            IO.pure(next.copy(future = rest))

      case Command.ToggleMuteTrack(trackName) =>
        val newTracks = tracks.map { t =>
          if t.name == trackName then
            t.copy(isMuted = !t.isMuted, isSolo = false)
          else t.copy(isSolo = false)
        }

        IO.pure(
          copy(
            tracks = newTracks,
            history = history :+ this,
            future = Nil
          )
        )

      case Command.ToggleSoloTrack(trackName) =>
        val newTracks = tracks.map { t =>
          if t.name == trackName then
            t.copy(isSolo = !t.isSolo, isMuted = false)
          else t.copy(isSolo = false, isMuted = false)
        }

        IO.pure(
          copy(
            tracks = newTracks,
            history = history :+ this,
            future = Nil
          )
        )

object SequencerState:
  val initial: SequencerState =
    SequencerState(
      "Hypnotic Techno",
      "Tresillo",
      List(
        Track(
          "Snare",
          "snare.wav",
          Some(MidiDrumType.ACOUSTIC_SNARE),
          List(
            Velocity.Normal,
            Velocity.None,
            Velocity.None,
            Velocity.None
          ),
          false,
          false
        )
      ),
      128,
      4,
      4,
      1,
      Nil,
      Nil
    )
