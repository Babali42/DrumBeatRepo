package com.drumbeatrepo.sequencer

case class SequencerState(
    genre: String,
    beat: String,
    tempo: Int,
    history: List[SequencerState],
    future: List[SequencerState]
):
  def dispatch(command: Command): SequencerState = command match
    case Command.SelectBeat(newGenre, newBeat, newTempo) =>
      SequencerState(newGenre, newBeat, newTempo, history :+ this, future = Nil)
    case Command.SetTempo(newTempo) =>
      history match
        case _ :+ last if last.genre == genre && last.beat == beat =>
          SequencerState(genre, beat, newTempo, history, future = Nil)
        case _ =>
          SequencerState(genre, beat, newTempo, history :+ this, future = Nil)
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
    SequencerState("Hypnotic Techno", "Tresillo", 128, Nil, Nil)
