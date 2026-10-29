package com.drumbeatrepo.sequencer

import cats.effect.IO
import com.drumbeatrepo.domain.MidiDrumType

final case class SequencerState(
    genre: String,
    beat: String,
    tracks: List[Track],
    tempo: Int,
    beatsPerBar: Int,
    subdivisionsPerBeat: Int,
    numberOfBars: Int,
    history: List[SequencerState],
    future: List[SequencerState]
):
  def dispatch(command: Command): IO[SequencerState] =
    command match
      case Command.SelectBeat(newGenre, newBeat) =>
        IO.pure(
          SequencerState(
            newGenre,
            newBeat,
            List(
              Track(
                "kick",
                "metal/kick.mp3",
                Some(MidiDrumType.BASS_DRUM_1),
                List(
                  Velocity.Normal,
                  Velocity.None,
                  Velocity.None,
                  Velocity.None,
                  Velocity.Normal,
                  Velocity.None,
                  Velocity.None,
                  Velocity.None,
                  Velocity.Normal,
                  Velocity.None,
                  Velocity.None,
                  Velocity.None,
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
            history :+ this,
            future = Nil
          )
        )

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
                numberOfBars,
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
                numberOfBars,
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
      List.empty,
      128,
      4,
      4,
      1,
      Nil,
      Nil
    )
