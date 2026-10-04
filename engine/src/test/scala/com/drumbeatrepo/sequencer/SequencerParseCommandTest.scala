package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.shouldBe

class SequencerParseCommandTest extends AnyFunSuite {
  test("ADD_TRACK command is parsed from JS") {
    // arrange
    val cmd = scala.scalajs.js.Dynamic.literal(
      "type" -> "ADD_TRACK",
      "payload" -> scala.scalajs.js.Dynamic.literal(
        "track" -> scala.scalajs.js.Dynamic.literal(
          "name" -> "Kick",
          "filename" -> "Kick.mp3",
          "midiNote" -> 35,
          "steps" -> scala.scalajs.js
            .Array[Boolean](true, false, false, false),
          "isMuted" -> false,
          "isSolo" -> false
        )
      )
    )

    // act
    val result = Command.fromJS(cmd);

    // assert
    result shouldBe Command.AddTrack(
      Track(
        "Kick",
        "Kick.mp3",
        Some(MidiDrumType.ACOUSTIC_BASS_DRUM),
        List(
          Velocity.Normal,
          Velocity.None,
          Velocity.None,
          Velocity.None
        ),
        false,
        false
      )
    )
  }

  test("SET_STEPS command is parsed from JS") {
    // arrange
    val cmd = scala.scalajs.js.Dynamic.literal(
      `type` = "SET_STEPS",
      payload = scala.scalajs.js.Dynamic.literal(
        trackName = "Kick",
        fromStepIndex = 2,
        toStepIndex = 4,
        velocity = false
      )
    )

    // act
    val result = Command.fromJS(cmd);

    // assert
    result shouldBe Command.SetSteps("Kick", 2, 4, Velocity.None)
  }

  test("TOGGLE_STEP command is parsed from JS") {
    // arrange
    val cmd = scala.scalajs.js.Dynamic.literal(
      `type` = "TOGGLE_STEP",
      payload = scala.scalajs.js.Dynamic.literal(
        trackName = "Snare",
        stepIndex = 2
      )
    )

    // act
    val result = Command.fromJS(cmd)

    // assert
    result shouldBe Command.ToggleStep("Snare", 2)
  }

  test("Track serialization preserves the mute flag") {
    val original = Track(
      "Kick",
      "kick.mp3",
      Some(MidiDrumType.ACOUSTIC_BASS_DRUM),
      List(Velocity.Normal, Velocity.None),
      true,
      true
    )

    val roundTripped =
      Track.fromJS(Track.toJS(original).asInstanceOf[scala.scalajs.js.Dynamic])

    roundTripped.isMuted shouldBe true
    roundTripped.steps.head shouldBe Velocity.Normal
  }

  test("SOLO_TRACK command should be parsed from JS") {
    // arrange
    val cmd = scala.scalajs.js.Dynamic.literal(
      `type` = "TOGGLE_SOLO_TRACK",
      payload = scala.scalajs.js.Dynamic.literal(
        trackName = "Snare"
      )
    )

    // act
    val result = Command.fromJS(cmd)

    // assert
    result shouldBe Command.ToggleSoloTrack("Snare")
  }
}
