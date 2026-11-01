package com.drumbeatrepo.sequencer

import cats.effect.testing.scalatest.AsyncIOSpec
import org.scalatest.matchers.should.Matchers.shouldBe
import org.scalatest.funsuite.AsyncFunSuite

import scala.concurrent.ExecutionContext

given ExecutionContext = ExecutionContext.global

class SequencerStaterTest extends AsyncFunSuite with AsyncIOSpec {
  private val initial = SequencerState.initial;

  test("dispatch SelectBeat should sets the beat") {
    initial
      // act
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor")
      )
      // assert
      .map { after =>
        after.genre shouldBe "Techno";
        after.beat shouldBe "4 on the floor";
        after.tempo shouldBe 128;
        after.beatsPerBar shouldBe 4;
        after.subdivisionsPerBeat shouldBe 4;
        after.numberOfBars shouldBe 1;
      }
      .unsafeToFuture()

  }

  test("Should sets the tempo") {
    initial
      // act
      .dispatch(Command.SetTempo(126))
      // assert
      .map { after =>
        after.tempo shouldBe 126;
      }
      .unsafeToFuture()
  }

  test("ToggleStep should toggles a step from true to false") {
    (for
      // act
      after <- initial.dispatch(Command.ToggleStep("Snare", 0))
    yield
      // assert
      after.tracks.head.steps(0) shouldBe Velocity.None).unsafeToFuture()
  }

  test("ToggleStep should toggles a step from false to true") {
    (for
      // act
      after <- initial.dispatch(Command.ToggleStep("Snare", 1))
    yield
      // assert
      after.tracks.head.steps(1) shouldBe Velocity.Normal)
      .unsafeToFuture()
  }

  test("ToggleStep should adds to history") {
    (for
      // act
      after <- initial.dispatch(Command.ToggleStep("Snare", 0))
    yield
      // assert
      after.history.length shouldBe 1
      after.history.last.tracks.head.steps(0) shouldBe Velocity.Normal
    )
      .unsafeToFuture()
  }

  test("dispatch AddTrack should add a track to a beat") {
    (for
      // act
      after <- initial.dispatch(
        Command.AddTrack(
          Track("Synth", "Synth.mp3", None, List.empty, true, false)
        )
      )
    yield
      // assert
      after.tracks.length shouldBe 2)
      .unsafeToFuture()
  }

  test("ToggleSoloTrack should unsolo other solo track") {
    (for
      beatWithSoloHat <- initial
        .dispatch(
          Command.AddTrack(
            Track("Synth", "Synth.mp3", None, List.empty, false, true)
          )
        )
      after <- beatWithSoloHat.dispatch(
        Command.AddTrack(
          Track("Synth", "Synth.mp3", None, List.empty, false, true)
        )
      )
      result <- after.dispatch(Command.ToggleSoloTrack("kick"))
    yield result.tracks
      .filter(_.name != "kick")
      .forall(_.isSolo == false) shouldBe true).unsafeToFuture()
  }

  test("dispatch SetSteps sets multiples steps in a row") {
    (for after <- initial.dispatch(
        Command.SetSteps("Snare", 1, 3, Velocity.Normal)
      )
    yield
      // assert
      after.tracks.head.steps(0) shouldBe Velocity.Normal
      after.tracks.head.steps(1) shouldBe Velocity.Normal
      after.tracks.head.steps(2) shouldBe Velocity.Normal
      after.tracks.head.steps(3) shouldBe Velocity.Normal
    ).unsafeToFuture();
  }

  test("toggleMuteTrack should mute a track") {
    // act
    (initial
      .dispatch(Command.ToggleMuteTrack("Snare"))
      .map(result => result.tracks.head.isMuted shouldBe true))
      .unsafeToFuture();
  }

  test("toggleSoloTrack should mute a track") {
    // act
    (initial
      .dispatch(Command.ToggleSoloTrack("Snare"))
      .map(result => result.tracks.head.isSolo shouldBe true))
      .unsafeToFuture();
  }

  test("toggleMuteTrack should unsolo all tracks") {
    (for
      beatWithOneSoloTrack <- initial
        .dispatch(
          Command.AddTrack(
            Track("Synth", "Synth.mp3", None, List.empty, false, true)
          )
        )
      beatWithTwoSoloTrack <- beatWithOneSoloTrack.dispatch(
        Command.AddTrack(
          Track("Synth2", "Synth2.mp3", None, List.empty, false, true)
        )
      )

      result <- beatWithTwoSoloTrack.dispatch(Command.ToggleMuteTrack("hat"))
    yield result.tracks.forall(!_.isSolo) shouldBe true).unsafeToFuture();
  }
}
