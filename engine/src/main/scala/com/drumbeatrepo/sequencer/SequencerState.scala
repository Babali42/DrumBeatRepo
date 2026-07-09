package com.drumbeatrepo.sequencer

import java.{util => ju}

case class SequencerState(
    genre: String,
    beat: String,
    tracks: List[Track],
    tempo: Int,
    history: List[SequencerState],
    future: List[SequencerState]
):
  def dispatch(command: Command): SequencerState = command match
    case Command.SelectBeat(newGenre, newBeat, newTracks, newTempo) =>
      SequencerState(
        newGenre,
        newBeat,
        newTracks,
        newTempo,
        history :+ this,
        future = Nil
      )
    case Command.ToggleStep(trackName, stepIndex) =>
      val newTracks = tracks.map(t =>
        if t.name == trackName then
          t.copy(steps = t.steps.updated(stepIndex, !t.steps(stepIndex)))
        else t
      )
      copy(tracks = newTracks, history = history :+ this, future = Nil)
    case Command.SetTempo(newTempo) =>
      history match
        case _ :+ last if last.genre == genre && last.beat == beat =>
          SequencerState(genre, beat, tracks, newTempo, history, future = Nil)
        case _ =>
          SequencerState(
            genre,
            beat,
            tracks,
            newTempo,
            history :+ this,
            future = Nil
          )
    case Command.Undo =>
      history match
        case init :+ last => last.copy(history = init, future = this :: future)
        case _            => this
    case Command.Redo =>
      future match
        case Nil          => this
        case next :: rest => next.copy(future = rest)

end SequencerState

object SequencerState:
  val initial: SequencerState =
    SequencerState("Hypnotic Techno", "Tresillo", List.empty, 128, Nil, Nil)
