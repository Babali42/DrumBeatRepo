package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import cats.effect.testing.scalatest.AsyncIOSpec
import org.scalatest.matchers.should.Matchers.shouldBe
import com.drumbeatrepo.domain.MidiDrumType
import org.scalatest.funsuite.AsyncFunSuite

import scala.concurrent.ExecutionContext

given ExecutionContext = ExecutionContext.global
import cats.effect.unsafe.implicits.global

class SequencerStaterTest extends AsyncFunSuite with AsyncIOSpec {
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

  test("undo should restores initial beat") {
    // act
    (for
      after <- initial.dispatch(
        Command.SelectBeat("Techno", "4 on the floor")
      )
      afterUndo <- after.dispatch(Command.Undo)
    yield
      // assert
      afterUndo.beat shouldBe initial.beat;)
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

  test("redo should should do nothing with empty future") {
    // act
    initial
      .dispatch(Command.Redo)
      // assert
      .map { after =>
        after shouldBe initial;
      }
      .unsafeToFuture();
  }

  test("undo should do nothing with empty history") {
    // act
    initial
      .dispatch(Command.Undo)
      // assert
      .map { after =>
        after.tempo shouldBe 126;
        after shouldBe initial;
      }
      .unsafeToFuture();
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

  test("ToggleStep should toggles a step from true to false") {
    (for
      // act
      after <- initial.dispatch(Command.ToggleStep("Snare", 0))
    yield
      // assert
      after.tracks.head.steps(0) shouldBe Velocity.Medium).unsafeToFuture()
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
      afterSnare.history.length shouldBe 21
      afterSnare.history.last.tracks.head.steps(0) shouldBe Velocity.Normal
    )
      .unsafeToFuture()
  }
  /*

  test("ToggleStep should clears future") {

    for
      // act
      after <- initial.dispatch()
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo;


    // act
    val after = initialWithTracks
      .dispatch(Command.ToggleStep("Snare", 0))
      .dispatch(Command.Undo)
      .dispatch(Command.ToggleStep("Snare", 1))

    // assert
    after.future shouldBe Nil
  }

  test("dispatch SetSteps sets multiples steps in a row") {

    for
      // act
      after <- initial.dispatch()
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo;


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
    for
      // act
      after <- initial.dispatch()
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo;


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
    for
      // act
      after <- initial.dispatch()
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo;


    // act
    val result =
      initialWithTracks.dispatch(Command.ToggleMuteTrack("Snare"))

    // assert
    result.tracks.head.isMuted shouldBe true
  }

  test("toggleMuteTrack should unsolo all tracks") {
    for
      // act
      after <- initial.dispatch()
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo;


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
    for
      // act
      after <- initial.dispatch()
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo;


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
    for
      // act
      after <- initial.dispatch()
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo;


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
    for
      // act
      after <- initial.dispatch()
    yield
      // assert
      afterUndo.tempo shouldBe initial.tempo;


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
