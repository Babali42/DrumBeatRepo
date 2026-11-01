package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.shouldBe

import scala.scalajs.js
import com.drumbeatrepo.domain.MidiDrumType

class SequencerEngineGetStateSpec extends AnyFunSuite {
  // todo rewrite this test with a beat containing multiple tracks
  test("getState should return tracks sorted by midi.track") {
    SequencerEngine.reset()

    SequencerEngine.dispatch(Command.SelectBeat("", ""));

    val state = SequencerEngine.getState().asInstanceOf[js.Dynamic]
    state.beatsPerBar.asInstanceOf[js.Dynamic].asInstanceOf[Int] shouldBe 4
    state.subdivisionsPerBeat
      .asInstanceOf[js.Dynamic]
      .asInstanceOf[Int] shouldBe 4
    state.numberOfBars.asInstanceOf[js.Dynamic].asInstanceOf[Int] shouldBe 1

    val tracks = state.tracks.asInstanceOf[js.Array[js.Dynamic]]

    val midiNotes =
      tracks.map { t =>
        val note = t.midiNote
        if (js.isUndefined(note) || note == null) None
        else Some(note.asInstanceOf[Int])
      }.toSeq

    /*
    midiNotes shouldBe List(
      None,
      Some(MidiDrumType.OPEN_HI_HAT.midiNote),
      Some(MidiDrumType.ACOUSTIC_SNARE.midiNote),
      Some(MidiDrumType.ACOUSTIC_BASS_DRUM.midiNote)
    )
     */
    midiNotes shouldBe List(
      Some(MidiDrumType.ACOUSTIC_SNARE.midiNote)
    )
  }
}
