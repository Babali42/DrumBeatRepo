package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.shouldBe

class SequencerStateTest extends AnyFunSuite {
  test("dispatch SelectBeat sets the beat") {
    val state = SequencerState.initial
      .dispatch(Command.SelectBeat("Techno", "4 on the floor", Nil, 128));

    state.genre shouldBe "Techno";
    state.beat shouldBe "4 on the floor";
    state.tempo shouldBe 128;
  }

  test("dispatch SetTempo sets the tempo") {
    SequencerState.initial.dispatch(Command.SetTempo(126)).tempo shouldBe 126
  }

  test("undo restores initial beat") {
    val state = SequencerState(
      "Hypnotic Techno",
      "Tresillo",
      List.empty,
      128,
      Nil,
      Nil
    )
      .dispatch(Command.SelectBeat("Techno", "4 on the floor", List.empty, 128))
      .dispatch(Command.Undo)
    state.genre shouldBe "Hypnotic Techno";
    state.beat shouldBe "Tresillo";
    state.tempo shouldBe 128;
  }

  test("undo then redo restores the beat") {
    val state = SequencerState.initial
      .dispatch(Command.SelectBeat("Techno", "4 on the floor", List.empty, 128))
      .dispatch(Command.Undo)
      .dispatch(Command.Redo)
    state.beat shouldBe "4 on the floor";
    state.genre shouldBe "Techno";
    state.tempo shouldBe 128;
  }

  test("redo should do nothing with empty future") {
    SequencerState.initial.dispatch(
      Command.Redo
    ) shouldBe SequencerState.initial
  }

  test("undo should do nothing with empty history") {
    SequencerState.initial.dispatch(
      Command.Undo
    ) shouldBe SequencerState.initial
  }

  test("multiple changes in tempo shoud be undone once") {
    SequencerState.initial
      .dispatch(Command.SetTempo(123))
      .dispatch(Command.SetTempo(124))
      .dispatch(Command.SetTempo(125))
      .dispatch(Command.Undo)
      .tempo shouldBe SequencerState.initial.tempo
  }
}
