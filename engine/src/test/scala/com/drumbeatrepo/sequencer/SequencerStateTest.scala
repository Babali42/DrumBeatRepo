package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.shouldBe

class SequencerafterTest extends AnyFunSuite {
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
      false
    )
  )
  private val initialWithTracks = initial
    .dispatch(
      Command.SelectBeat("Techno", "4 on the floor", someTracks, 128, 4, 1, 1)
    )

  test("dispatch SelectBeat should sets the beat") {
    // act
    val after = initial
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor", Nil, 128, 4, 4, 1)
      );

    // assert
    after.genre shouldBe "Techno";
    after.beat shouldBe "4 on the floor";
    after.tempo shouldBe 128;
    after.beatsPerBar shouldBe 4;
    after.subdivisionsPerBeat shouldBe 4;
    after.numberOfBars shouldBe 1;
  }

  test("dispatch SetTempo should sets the tempo") {
    // act
    val after = initial.dispatch(Command.SetTempo(126));

    // assert
    after.tempo shouldBe 126;
  }

  test("undo should restores initial beat") {
    // act
    val after = initial
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor", List.empty, 128, 4, 4, 1)
      )
      .dispatch(Command.Undo)

    // assert
    after.beat shouldBe initial.beat;
  }

  test("undo then redo should restores the beat") {
    // act
    val after = initial
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor", List.empty, 128, 4, 4, 1)
      )
      .dispatch(Command.Undo)
      .dispatch(Command.Redo)

    // assert
    after.beat shouldBe "4 on the floor";
    after.genre shouldBe "Techno";
    after.tempo shouldBe 128;
  }

  test("redo should should do nothing with empty future") {
    // act
    val after = initial.dispatch(Command.Redo);

    // assert
    after shouldBe initial;
  }

  test("undo should do nothing with empty history") {
    // act
    val after = initial.dispatch(Command.Undo);

    // assert
    after shouldBe initial;
  }

  test("multiple changes in tempo should be undone once") {
    // act
    val after = initial
      .dispatch(Command.SetTempo(123))
      .dispatch(Command.SetTempo(124))
      .dispatch(Command.SetTempo(125))
      .dispatch(Command.Undo)
      .tempo;

    // assert
    after shouldBe initial.tempo
  }

  test("ToggleStep should toggles a step from true to false") {
    // act
    val after = initialWithTracks.dispatch(Command.ToggleStep("Snare", 0))

    // assert
    after.tracks.head.steps(0) shouldBe Velocity.None
  }

  test("ToggleStep should toggles a step from false to true") {
    // act
    val after = initialWithTracks.dispatch(Command.ToggleStep("Snare", 1))

    // assert
    after.tracks.head.steps(1) shouldBe Velocity.Normal
  }

  test("ToggleStep should adds to history") {
    // act
    val after = initialWithTracks.dispatch(Command.ToggleStep("Snare", 0))

    // assert
    after.history.length shouldBe 2
    after.history.last.tracks.head.steps(0) shouldBe Velocity.Normal
  }

  test("ToggleStep should clears future") {
    // act
    val after = initialWithTracks
      .dispatch(Command.ToggleStep("Snare", 0))
      .dispatch(Command.Undo)
      .dispatch(Command.ToggleStep("Snare", 1))

    // assert
    after.future shouldBe Nil
  }

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

  test("dispatch ToggleMuteTrack should mute a track") {
    // act
    val afterWithMutedTrack =
      initialWithTracks.dispatch(Command.ToggleMuteTrack("Snare"))

    // assert
    afterWithMutedTrack.tracks.head.isMuted shouldBe true
  }
}
