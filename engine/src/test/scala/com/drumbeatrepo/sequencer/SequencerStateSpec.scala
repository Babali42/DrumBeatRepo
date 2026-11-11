package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.*

class SequencerStateSpec extends AnyFunSuite {

  private val initial = SequencerState.initial

  test("Should sets the tempo") {
    val after =
      initial.dispatchPure(Command.SetTempo(126))

    after.tempo shouldBe 126
  }

  test("ToggleStep should toggles a step from true to false") {
    val after =
      initial.dispatchPure(Command.ToggleStep("Snare", 0))

    after.tracks.head.steps.head shouldBe Velocity.None
  }

  test("ToggleStep should toggles a step from false to true") {
    val after =
      initial.dispatchPure(Command.ToggleStep("Snare", 1))

    after.tracks.head.steps(1) shouldBe Velocity.Normal
  }

  test("ToggleStep should adds to history") {
    val after =
      initial.dispatchPure(Command.ToggleStep("Snare", 0))

    after.history.length shouldBe 1
    after.history.last.tracks.head.steps.head shouldBe Velocity.Normal
  }

  test("dispatch AddTrack should add a track to a beat") {
    val after =
      initial.dispatchPure(
        Command.AddTrack(
          TrackJS("Synth", "Synth.mp3", None, List.empty, true, false)
        )
      )

    after.tracks.length shouldBe 2
  }

  test("ToggleSoloTrack should undo solo other solo track") {
    val result =
      initial
        .dispatchPure(
          Command.AddTrack(
            TrackJS("Synth", "Synth.mp3", None, List.empty, false, true)
          )
        )
        .dispatchPure(
          Command.AddTrack(
            TrackJS("Synth", "Synth.mp3", None, List.empty, false, true)
          )
        )
        .dispatchPure(Command.ToggleSoloTrack("kick"))

    result.tracks
      .filter(_.name != "kick")
      .forall(!_.isSolo) shouldBe true
  }

  test("dispatch SetSteps sets multiples steps in a row") {
    val after =
      initial.dispatchPure(
        Command.SetSteps("Snare", 1, 3, Velocity.Normal)
      )

    after.tracks.head.steps.head shouldBe Velocity.Normal
    after.tracks.head.steps(1) shouldBe Velocity.Normal
    after.tracks.head.steps(2) shouldBe Velocity.Normal
    after.tracks.head.steps(3) shouldBe Velocity.Normal
  }

  test("toggleMuteTrack should mute a track") {
    val result =
      initial.dispatchPure(Command.ToggleMuteTrack("Snare"))

    result.tracks.head.isMuted shouldBe true
  }

  test("toggleSoloTrack should mute a track") {
    val result =
      initial.dispatchPure(Command.ToggleSoloTrack("Snare"))

    result.tracks.head.isSolo shouldBe true
  }

  test("toggleMuteTrack should undo solo all tracks") {
    val result =
      initial
        .dispatchPure(
          Command.AddTrack(
            TrackJS("Synth", "Synth.mp3", None, List.empty, false, true)
          )
        )
        .dispatchPure(
          Command.AddTrack(
            TrackJS("Synth2", "Synth2.mp3", None, List.empty, false, true)
          )
        )
        .dispatchPure(Command.ToggleMuteTrack("hat"))

    result.tracks.forall(!_.isSolo) shouldBe true
  }
}
