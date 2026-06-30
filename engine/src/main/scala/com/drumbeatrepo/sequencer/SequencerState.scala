package com.drumbeatrepo.sequencer

case class SequencerState(
    genre: String,
    beat: String,
    tempo: Int,
    history: List[SequencerState],
    future: List[SequencerState]
):

  def dispatch(command: Command): SequencerState = command match
    case Command.SelectGenre(newGenre) =>
      SequencerState(newGenre, beat, tempo, history :+ this, future)
    case Command.SelectBeat(newBeat) =>
      SequencerState(genre, newBeat, tempo, history :+ this, future)
    case Command.SetTempo(newTempo) =>
      SequencerState(genre, beat, newTempo, history :+ this, future)
    case Command.Undo =>
      history match
        case init :+ last => last.copy(history = init, future = this :: future)
        case _            => this
    case Command.Redo =>
      future match
        case Nil          => this
        case next :: rest =>
          val prevHistory = history
          next.copy(history = prevHistory :+ next, future = rest)

end SequencerState

object SequencerState:
  val initial: SequencerState =
    SequencerState("Hypnotic Techno", "Tresillo", 128, Nil, Nil)
