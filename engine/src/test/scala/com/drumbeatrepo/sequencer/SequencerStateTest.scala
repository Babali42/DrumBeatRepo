package com.drumbeatrepo.sequencer

import cats.effect.testing.scalatest.AsyncIOSpec
import org.scalatest.matchers.should.Matchers.shouldBe
import org.scalatest.funsuite.AsyncFunSuite

import scala.concurrent.ExecutionContext

given ExecutionContext = ExecutionContext.global

class SequencerStaterTest extends AsyncFunSuite with AsyncIOSpec {
  private val initial = SequencerState.initial;
  private val initialWithTracks = initial
    .dispatch(
      Command.SelectBeat("Techno", "4 on the floor")
    )

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

  test("dispatch SetTempo should sets the tempo") {
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
      after <- initialWithTracks
      afterSnare <- after.dispatch(Command.ToggleStep("Snare", 0))
    yield
      // assert
      afterSnare.history.length shouldBe 1
      afterSnare.history.last.tracks.head.steps(0) shouldBe Velocity.Normal
    )
      .unsafeToFuture()
  }
  /*
  test("dispatch SetSteps sets multiples steps in a row") {
    // act
    val after = initialWithTracks.dispatch(
      Command.SetSteps("Snare", 1, 3, Velocity.Normal)
    );

    // assert
    after.tracks.head.steps(0) shouldBe Velocity.Normal
    after.tracks.head.steps(1) shouldBe Velocity.Normal
    after.tracks.head.steps(2) shouldBe Velocity.Normal
    after.tracks.head.steps(3) shouldBe Velocity.Normal
  }

  test("dispatch AddTrack should add a track to a beat") {
    // act
    val after = initial
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "kick")
        )
      );

    // assert
    after.tracks.length shouldBe 1
  }

  test("toggleMuteTrack should mute a track") {
    // act
    val result =
      initialWithTracks.dispatch(Command.ToggleMuteTrack("Snare"))

    // assert
    result.tracks.head.isMuted shouldBe true
  }

  test("toggleMuteTrack should unsolo all tracks") {
    // arrange
    val threeTrackBeatWithSoloHat = initial
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "kick", isSolo = true)
        )
      )
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "hat", isSolo = true)
        )
      );

    // act
    val result =
      threeTrackBeatWithSoloHat.dispatch(Command.ToggleMuteTrack("hat"))

    // assert
    result.tracks
      .forall(_.isSolo == false) shouldBe true
  }

  test("ToggleSoloTrack should solo a track") {
    // arrange
    val threeTrackBeat = initial
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "kick")
        )
      )
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "hat")
        )
      );

    // act
    val result = threeTrackBeat.dispatch(Command.ToggleSoloTrack("kick"))

    // assert
    result.tracks.find(_.name == "kick").head.isSolo shouldBe true
  }

  test("ToggleSoloTrack should unsolo other solo track") {
    // arrange
    val threeTrackBeatWithSoloHat = initial
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "kick")
        )
      )
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "hat", isSolo = true)
        )
      );

    // act
    val result =
      threeTrackBeatWithSoloHat.dispatch(Command.ToggleSoloTrack("kick"))

    // assert
    result.tracks
      .filter(_.name != "kick")
      .forall(_.isSolo == false) shouldBe true
  }

  test("ToggleSoloTrack should unmute all tracks") {
    // arrange
    val threeTrackBeatAllMuted = initial
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "kick", isMuted = true)
        )
      )
      .dispatch(
        Command.AddTrack(
          someTracks.head.copy(name = "hat", isSolo = true, isMuted = true)
        )
      );

    // act
    val result =
      threeTrackBeatAllMuted.dispatch(Command.ToggleSoloTrack("kick"))

    // assert
    result.tracks.forall(_.isMuted == false) shouldBe true
  }*/
}
