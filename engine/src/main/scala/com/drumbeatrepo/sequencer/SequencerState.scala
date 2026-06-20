package scala.com.drumbeatrepo.sequencer

case class SequencerState(genre: String, beat: String, tempo: Int, history: List[Command], future: List[Command]):

  def dispatch(command: Command): SequencerState = command match
    case Command.SelectGenre(newGenre) =>
      SequencerState(newGenre, beat, tempo, history :+ command, future)
    case Command.SelectBeat(newBeat) =>
      SequencerState(genre, newBeat, tempo, history :+ command, future)
    case Command.SetTempo(newTempo) =>
      SequencerState(genre, beat, newTempo, history :+ command, future)
    case Command.Undo =>
      history match
        case Nil => this
        case _ =>
          val undone = history.last
          val remaining = history.init
          remaining.foldLeft(
            SequencerState(SequencerState.initial.genre, SequencerState.initial.beat, tempo, Nil, undone :: future)
          ) { (s, cmd) =>
            s.dispatch(cmd)
          }
    case Command.Redo =>
      future match
        case Nil => this
        case next :: rest =>
          val prevHistory = history
          dispatch(next).copy(history = prevHistory :+ next, future = rest)

end SequencerState

object SequencerState:
  val initial: SequencerState = SequencerState("Hypnotic Techno", "Tresillo", 128, Nil, Nil)
