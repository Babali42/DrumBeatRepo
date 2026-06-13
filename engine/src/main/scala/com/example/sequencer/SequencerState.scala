package com.example.sequencer

case class SequencerState(
  steps: Vector[Boolean],
  currentStep: Int,
  history: List[Command],
  future: List[Command],
):

  def dispatch(command: Command): SequencerState = command match
    case Command.ToggleStep(index) =>
      if index >= 0 && index < 16 then
        SequencerState(steps.updated(index, !steps(index)), currentStep, history :+ command, future)
      else this
    case Command.SetCurrentStep(index) =>
      if index >= -1 && index < 16 then
        SequencerState(steps, index, history :+ command, future)
      else this
    case Command.ClearAll =>
      SequencerState(Vector.fill(16)(false), currentStep, history :+ command, future)
    case Command.Undo =>
      history match
        case Nil => this
        case _ =>
          val undone = history.last
          val remaining = history.init
          remaining.foldLeft(SequencerState(Vector.fill(16)(false), -1, Nil, undone :: future)) { (s, cmd) =>
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
  val initial: SequencerState = SequencerState(Vector.fill(16)(false), -1, Nil, Nil)
