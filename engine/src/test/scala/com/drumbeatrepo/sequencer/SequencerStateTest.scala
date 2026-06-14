package scala.com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.shouldBe


class SequencerStateTest extends AnyFunSuite {
  test("dispatch SelectBeat sets the beat") {
    SequencerState("", "", Nil, Nil).dispatch(Command.SelectBeat("Techno")).beat shouldBe "Techno"
  }

  test("undo restores initial beat") {
    val state = SequencerState("", "", Nil, Nil)
      .dispatch(Command.SelectBeat("Techno"))
      .dispatch(Command.Undo)
    state.beat shouldBe ""
  }

  test("undo then redo restores the beat") {
    val state = SequencerState("", "", Nil, Nil)
      .dispatch(Command.SelectBeat("4 on the floor"))
      .dispatch(Command.Undo)
      .dispatch(Command.Redo)
    state.beat shouldBe "4 on the floor"
  }
}