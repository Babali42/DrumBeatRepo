package com.drumbeatrepo.sequencer

case class SequencerState(
                           genre: String,
                           beat: String,
                           history: List[Command],
                           future: List[Command]
                         ):

  def dispatch(command: Command): SequencerState = command match
    case Command.SelectGenre(newGenre) =>
      SequencerState(
        newGenre,
        beat,
        history :+ command,
        future
      )
    case Command.SelectBeat(newBeat) =>
      SequencerState(genre, newBeat, history :+ command, future)
    case Command.ClearAll =>
      SequencerState(
        SequencerState.initial.beat,
        SequencerState.initial.genre,
        history :+ command,
        future
      )
    case Command.Undo =>
      history match
        case Nil => this
        case _ =>
          val undone = history.last
          val remaining = history.init
          remaining.foldLeft(
            SequencerState(
              SequencerState.initial.beat,
              SequencerState.initial.genre,
              Nil,
              undone :: future
            )
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
  val initial: SequencerState = SequencerState("", "", Nil, Nil)
