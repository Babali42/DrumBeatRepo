package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.shouldBe
import scala.scalajs.js

class SequencerEngineTest extends AnyFunSuite {
  test("getState should return tracks sorted by midi.track") {
    val trackKick =
      Track("Kick", "Kick.wav", Some(MidiDrumType.ACOUSTIC_BASS_DRUM), Nil);
    val trackSnare =
      Track("Snare", "Snare.wav", Some(MidiDrumType.ACOUSTIC_SNARE), Nil);
    val trackHat =
      Track("Hat", "Hat.wav", Some(MidiDrumType.OPEN_HI_HAT), Nil);
    val trackBass = Track("Bass", "Bass.wav", None, Nil);

    SequencerEngine.reset()

    SequencerEngine.dispatch(
      Command
        .SelectBeat(
          "",
          "",
          List(trackBass, trackHat, trackKick, trackSnare),
          128
        )
    );

    val state = SequencerEngine.getState().asInstanceOf[js.Dynamic]

    val tracks = state.tracks.asInstanceOf[js.Array[js.Dynamic]]

    val midiNotes =
      tracks.map { t =>
        val note = t.midiNote
        if (js.isUndefined(note) || note == null) None
        else Some(note.asInstanceOf[Int])
      }.toSeq

    midiNotes shouldBe List(
      None,
      Some(MidiDrumType.OPEN_HI_HAT.midiNote),
      Some(MidiDrumType.ACOUSTIC_SNARE.midiNote),
      Some(MidiDrumType.ACOUSTIC_BASS_DRUM.midiNote)
    )
  }
}
