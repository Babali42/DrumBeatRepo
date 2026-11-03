package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.*

class UndoRedoSpec extends AnyFunSuite {

  private val initial = SequencerState.initial

  test("redo should do nothing with empty future") {
    val after = initial.dispatchPure(Command.Redo)

    after shouldBe initial
  }

  test("undo should do nothing with empty history") {
    val after = initial.dispatchPure(Command.Undo)

    after shouldBe initial
  }

  test("multiple changes in tempo should be undone once") {
    val afterUndo =
      initial
        .dispatchPure(Command.SetTempo(123))
        .dispatchPure(Command.SetTempo(124))
        .dispatchPure(Command.SetTempo(125))
        .dispatchPure(Command.Undo)

    afterUndo.tempo shouldBe initial.tempo
  }

  test("ToggleStep should clears future") {
    val stateResult =
      initial
        .dispatchPure(Command.ToggleStep("Snare", 0))
        .dispatchPure(Command.Undo)
        .dispatchPure(Command.ToggleStep("Snare", 0))

    stateResult.future shouldBe Nil
  }
}