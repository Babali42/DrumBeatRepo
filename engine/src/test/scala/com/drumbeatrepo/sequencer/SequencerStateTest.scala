package scala.com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.shouldBe


class SequencerStateTest extends AnyFunSuite {
  test("dispatch SelectBeat sets the beat") {
    SequencerState.initial.dispatch(Command.SelectBeat("Techno")).beat shouldBe "Techno"
  }

  test("dispatch SelectGenre sets the genre") {
    SequencerState.initial.dispatch(Command.SelectGenre("Metal")).genre shouldBe "Metal"
  }
  
  test("dispatch SetTempo sets the tempo") {
    SequencerState.initial.dispatch(Command.SetTempo(126)).tempo shouldBe 126
  }

  test("undo restores initial beat") {
    val state = SequencerState("Hypnotic Techno", "Tresillo", 128, Nil, Nil)
      .dispatch(Command.SelectBeat("Techno"))
      .dispatch(Command.Undo)
    state.genre shouldBe "Hypnotic Techno"
  }

  test("undo then redo restores the beat") {
    val state = SequencerState.initial
      .dispatch(Command.SelectBeat("4 on the floor"))
      .dispatch(Command.Undo)
      .dispatch(Command.Redo)
    state.beat shouldBe "4 on the floor"
  }

  test("redo should do nothing with empty future") {
    SequencerState.initial.dispatch(Command.Redo) shouldBe SequencerState.initial
  }

  test("undo should do nothing with empty history") {
    SequencerState.initial.dispatch(Command.Undo) shouldBe SequencerState.initial
  }
}