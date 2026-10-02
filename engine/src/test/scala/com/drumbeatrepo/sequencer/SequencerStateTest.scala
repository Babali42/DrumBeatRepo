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

  test("dispatch SelectBeat sets the beat") {
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

  test("dispatch SetTempo sets the tempo") {
    // act
    val after = initial.dispatch(Command.SetTempo(126));

    // assert
    after.tempo shouldBe 126;
  }

  test("undo restores initial beat") {
    // act
    val after = initial
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor", List.empty, 128, 4, 4, 1)
      )
      .dispatch(Command.Undo)

    // assert
    after.beat shouldBe initial.beat;
  }

  test("undo then redo restores the beat") {
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

  test("redo should do nothing with empty future") {
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

  test("multiple changes in tempo shoud be undone once") {
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

  test("ToggleStep toggles a step from true to false") {
    // act
    val after = initial
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor", someTracks, 128, 4, 1, 1)
      )
      .dispatch(Command.ToggleStep("Snare", 0))

    // assert
    after.tracks.head.steps(0) shouldBe Velocity.None
  }

  test("ToggleStep toggles a step from false to true") {
    // act
    val after = initial
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor", someTracks, 128, 4, 1, 1)
      )
      .dispatch(Command.ToggleStep("Snare", 1))

    // assert
    after.tracks.head.steps(1) shouldBe Velocity.Normal
  }

  test("ToggleStep adds to history") {
    // act
    val after = initial
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor", someTracks, 128, 4, 1, 1)
      )
    val toggled = after.dispatch(Command.ToggleStep("Snare", 0))

    // assert
    toggled.history.length shouldBe 2
    toggled.history.last.tracks.head.steps(0) shouldBe Velocity.Normal
  }

  test("ToggleStep clears future") {
    // act
    val after = initial
      .dispatch(
        Command.SelectBeat("Techno", "4 on the floor", someTracks, 128, 4, 1, 1)
      )
      .dispatch(Command.ToggleStep("Snare", 0))
      .dispatch(Command.Undo)
      .dispatch(Command.ToggleStep("Snare", 1))

    // assert
    after.future shouldBe Nil
  }

  test("dispatch SetSteps sets multiples steps in a row") {
    // act
    val after = initial
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
              ),
              false
            )
          ),
          128,
          4,
          1,
          1
        )
      )
      .dispatch(Command.SetSteps("kick", 1, 3, Velocity.Normal));

    // assert
    after.tracks.head.steps(0) shouldBe Velocity.Normal
    after.tracks.head.steps(1) shouldBe Velocity.Normal
    after.tracks.head.steps(2) shouldBe Velocity.Normal
    after.tracks.head.steps(3) shouldBe Velocity.Normal
  }

  test("Track serialization preserves the mute flag") {
    val original = Track(
      "Kick",
      "kick.mp3",
      Some(MidiDrumType.ACOUSTIC_BASS_DRUM),
      List(Velocity.Normal, Velocity.None),
      true
    )

    val roundTripped =
      Track.fromJS(Track.toJS(original).asInstanceOf[scala.scalajs.js.Dynamic])

    roundTripped.isMuted shouldBe true
    roundTripped.steps.head shouldBe Velocity.Normal
  }

  test("dispatch AddTrack add a track to a beat") {
    // act
    val after = initial
      .dispatch(
        Command.AddTrack(
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
            ),
            false
          )
        )
      );

    // assert
    after.tracks.length shouldBe 1
  }

  test("dispatch ToggleMuteTrack mute a track") {
    // arrange
    val after = initial
      .dispatch(
        Command.AddTrack(
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
            ),
            false
          )
        )
      );

    // act
    val afterWithMutedTrack = after.dispatch(Command.ToggleMuteTrack("kick"))

    // assert
    afterWithMutedTrack.tracks.head.isMuted shouldBe true
  }
}
