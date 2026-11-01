package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import cats.effect.testing.scalatest.AsyncIOSpec
import org.scalatest.matchers.should.Matchers.shouldBe
import com.drumbeatrepo.domain.MidiDrumType
import org.scalatest.funsuite.AsyncFunSuite

import scala.concurrent.ExecutionContext

given ExecutionContext = ExecutionContext.global
import cats.effect.unsafe.implicits.global

class UndoRedoTest extends AsyncFunSuite with AsyncIOSpec {
  private val initial = SequencerState.initial;
  private val someTracks = List(
    Track(
      "Snare",
      "snare.wav",
      Some(MidiDrumType.ACOUSTIC_SNARE),
      List(
        Velocity.Normal,
        Velocity.None,
        Velocity.Normal,
        Velocity.None,
        Velocity.Normal,
        Velocity.None,
        Velocity.Normal,
        Velocity.None
      ),
      false,
      false
    )
  )

  test("undo should restores initial beat") {
    // act
    (for
      after <- initial.dispatch(
        Command.SelectBeat("Techno", "4 on the floor")
      )
      afterUndo <- after.dispatch(Command.Undo)
    yield
      // assert
      afterUndo.beat shouldBe initial.beat)
      .unsafeToFuture()
  }

  test("undo then redo should restore the beat") {
    (for
      after <- initial.dispatch(
        Command.SelectBeat("Techno", "4 on the floor")
      )
      afterUndo <- after.dispatch(Command.Undo)
      afterRedo <- afterUndo.dispatch(Command.Redo)
    yield
      afterRedo.beat shouldBe "4 on the floor"
      afterRedo.genre shouldBe "Techno"
      afterRedo.tempo shouldBe 128
    )
      .unsafeToFuture()
  }

  test("redo should do nothing with empty future") {
    (for after <- initial.dispatch(Command.Redo)
    yield after shouldBe initial).unsafeToFuture()
  }

  test("undo should do nothing with empty history") {
    (for after <- initial.dispatch(Command.Undo)
    yield after shouldBe initial).unsafeToFuture()
  }

  test("multiple changes in tempo should be undone once") {
    (for
      // act
      after <- initial.dispatch(Command.SetTempo(123))
      afterSetTempo124 <- after.dispatch(Command.SetTempo(124))
      afterSetTempo125 <- afterSetTempo124.dispatch(Command.SetTempo(125))
      afterUndo <- afterSetTempo125.dispatch(Command.Undo)
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo)
      .unsafeToFuture();
  }

  test("ToggleStep should clears future") {
    (for
      // act
      stepToggled <- initial.dispatch(Command.ToggleStep("Snare", 0))
      stepToggledAndUndone <- stepToggled.dispatch(Command.Undo)
      stepToggledAndUndoneAndToggled <- stepToggled.dispatch(
        Command.ToggleStep("Snare", 0)
      )
    yield
      // assert
      stepToggledAndUndoneAndToggled.future shouldBe Nil).unsafeToFuture();
  }
}
