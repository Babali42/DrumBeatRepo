package com.example.sequencer

import scala.scalajs.js
import scala.scalajs.js.annotation.*
import scala.scalajs.js.JSConverters.*

@JSExportTopLevel("SequencerEngine")
object SequencerEngine:
  private var state: SequencerState = SequencerState.initial

  @JSExport
  def dispatch(cmd: js.Dynamic): Unit =
    val command = Command.fromJS(cmd)
    command match
      case Command.Undo | Command.Redo => state = state.dispatch(command)
      case _                           => state = state.dispatch(command).copy(future = Nil)

  @JSExport
  def reset(): Unit =
    state = SequencerState.initial

  @JSExport
  def getState(): js.Object =
    val stepObjs = state.steps.map: active =>
      js.Dynamic.literal(active = active)
    js.Dynamic.literal(
      steps = stepObjs.toJSArray,
      currentStep = if state.currentStep >= 0 then state.currentStep.asInstanceOf[js.Any] else null,
      historyLength = state.history.length,
      futureLength = state.future.length,
    )
