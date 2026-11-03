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
  def execute(state: SequencerState, command: Command): IO[SequencerState] =
    command match
      case Command.SelectBeat(filename) =>
        val beatLoader = new HttpBeatLoader();

        for beat <- beatLoader.load(filename)
        yield SequencerState(
          beat.genre,
          beat.label,
          beat.tracks.map(x =>
            Track(
              x.name,
              x.filename,
              x.midiNote,
              x.steps.toCharArray
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

      case other =>
        IO.pure(state.dispatchPure(other))

  def dispatchPure(command: Command): SequencerState =
    command match
      case Command.ToggleStep(trackName, stepIndex) =>
        tracks.find(_.name == trackName) match
          case None =>
            this

          case Some(track) =>
            if stepIndex < 0 || stepIndex >= track.steps.length then this
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

              copy(
                tracks = newTracks,
                history = history :+ this,
                future = Nil
              )

      case Command.SetSteps(trackName, fromStepIndex, toStepIndex, velocity) =>
        if fromStepIndex < 0 || toStepIndex < fromStepIndex then this
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

          if newTracks == tracks then this
          else
            copy(
              tracks = newTracks,
              history = history :+ this,
              future = Nil
            )

      case Command.SetTempo(newTempo) =>
        history match
          case _ :+ last if last.genre == genre && last.beat == beat =>
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

          case _ =>
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

      case Command.AddTrack(track) =>
        copy(
          tracks = tracks :+ track,
          history = history :+ this,
          future = Nil
        )

      case Command.Undo =>
        history match
          case init :+ last =>
            last.copy(history = init, future = this :: future)
          case _ =>
            this

      case Command.Redo =>
        future match
          case Nil          => this
          case next :: rest =>
            next.copy(future = rest)

      case Command.ToggleMuteTrack(trackName) =>
        val newTracks = tracks.map { t =>
          if t.name == trackName then
            t.copy(isMuted = !t.isMuted, isSolo = false)
          else t.copy(isSolo = false)
        }

        copy(
          tracks = newTracks,
          history = history :+ this,
          future = Nil
        )

      case Command.ToggleSoloTrack(trackName) =>
        val newTracks = tracks.map { t =>
          if t.name == trackName then
            t.copy(isSolo = !t.isSolo, isMuted = false)
          else t.copy(isSolo = false, isMuted = false)
        }

        copy(
          tracks = newTracks,
          history = history :+ this,
          future = Nil
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
