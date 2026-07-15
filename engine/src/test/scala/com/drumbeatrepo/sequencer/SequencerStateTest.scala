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

  val someTracks = List(
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
      )
    )
  )

  test("ToggleStep toggles a step from true to false") {
    val state = SequencerState.initial
      .dispatch(Command.SelectBeat("Techno", "4 on the floor", someTracks, 128))
      .dispatch(Command.ToggleStep("Snare", 0))
    state.tracks.head.steps(0) shouldBe Velocity.None
  }

  test("ToggleStep toggles a step from false to true") {
    val state = SequencerState.initial
      .dispatch(Command.SelectBeat("Techno", "4 on the floor", someTracks, 128))
      .dispatch(Command.ToggleStep("Snare", 1))
    state.tracks.head.steps(1) shouldBe Velocity.Normal
  }

  test("ToggleStep adds to history") {
    val state = SequencerState.initial
      .dispatch(Command.SelectBeat("Techno", "4 on the floor", someTracks, 128))
    val toggled = state.dispatch(Command.ToggleStep("Snare", 0))
    toggled.history.length shouldBe 2
    toggled.history.last.tracks.head.steps(0) shouldBe Velocity.Normal
  }

  test("ToggleStep clears future") {
    val state = SequencerState.initial
      .dispatch(Command.SelectBeat("Techno", "4 on the floor", someTracks, 128))
      .dispatch(Command.ToggleStep("Snare", 0))
      .dispatch(Command.Undo)
      .dispatch(Command.ToggleStep("Snare", 1))
    state.future shouldBe Nil
  }

  test("ToggleStep can be undone") {
    val state = SequencerState.initial
      .dispatch(Command.SelectBeat("Techno", "4 on the floor", someTracks, 128))
      .dispatch(Command.ToggleStep("Snare", 0))
      .dispatch(Command.Undo)
    state.tracks.head.steps(0) shouldBe Velocity.Normal
  }

  test("TOGGLE_STEP command is parsed from JS") {
    val cmd = scala.scalajs.js.Dynamic.literal(
      `type` = "TOGGLE_STEP",
      payload = scala.scalajs.js.Dynamic.literal(
        trackName = "Snare",
        stepIndex = 2
      )
    )
    Command.fromJS(cmd) shouldBe Command.ToggleStep("Snare", 2)
  }

  test("dispatch SetSteps sets multiples steps in a row") {
    val state = SequencerState.initial
      .dispatch(
        Command.SelectBeat(
          "Techno",
          "4 on the floor",
          List(
            Track(
              "kick",
              "kick.mp3",
              Some(MidiDrumType.BASS_DRUM_1),
              List(
                Velocity.Normal,
                Velocity.None,
                Velocity.None,
                Velocity.None,
                Velocity.Normal,
                Velocity.None,
                Velocity.None,
                Velocity.None,
                Velocity.Normal,
                Velocity.None,
                Velocity.None,
                Velocity.None,
                Velocity.Normal,
                Velocity.None,
                Velocity.None,
                Velocity.None
              )
            )
          ),
          128
        )
      )
      .dispatch(Command.SetSteps("kick", 1, 3, Velocity.Normal));

    state.tracks.head.steps(0) shouldBe Velocity.Normal
    state.tracks.head.steps(1) shouldBe Velocity.Normal
    state.tracks.head.steps(2) shouldBe Velocity.Normal
    state.tracks.head.steps(3) shouldBe Velocity.Normal
  }

  test("SET_STEPS command is parsed from JS") {
    val cmd = scala.scalajs.js.Dynamic.literal(
      `type` = "SET_STEPS",
      payload = scala.scalajs.js.Dynamic.literal(
        trackName = "Kick",
        fromStepIndex = 2,
        toStepIndex = 4,
        velocity = false
      )
    )
    Command.fromJS(cmd) shouldBe Command.SetSteps("Kick", 2, 4, Velocity.None)
  }
}
