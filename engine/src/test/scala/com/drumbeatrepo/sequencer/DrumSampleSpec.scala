package com.drumbeatrepo.sequencer

import com.drumbeatrepo.sequencer.DrumCategory.{Kick, Snare}
import com.drumbeatrepo.sequencer.MidiDrumType.{ACOUSTIC_BASS_DRUM, ACOUSTIC_SNARE, BASS_DRUM_1, CRASH_CYMBAL_1}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.List

class DrumSampleSpec extends AnyFlatSpec with Matchers {
  it should "get drums samples and count drumCategories" in {
    //act
    val beats = List(Beat("techno", "techno", 128, 4, 4, 4, List(
        Track("kick", AudioFilename(""), "", Some(BASS_DRUM_1)),
        Track("snare", AudioFilename(""), "", Some(ACOUSTIC_SNARE)))),
      Beat("techno", "techno", 128, 4, 4, 4, List(
        Track("kick", AudioFilename(""), "", Some(ACOUSTIC_BASS_DRUM)))))
    val drumSamples = getDrumSamples(beats)

    //assert
    drumSamples.count(x => x.drumCategory == Snare) shouldBe 1
    drumSamples.count(x => x.drumCategory == Kick) shouldBe 2
  }

  it should "get drums samples and count drumCategories with a missing drum type" in {
    //act
    val beats = List(Beat("techno", "techno", 128, 4, 4, 4, List(
      Track("kick", AudioFilename(""), "", Some(BASS_DRUM_1)),
      Track("snare", AudioFilename(""), "", Some(ACOUSTIC_SNARE)))),
      Beat("techno", "techno", 128, 4, 4, 4, List(
        Track("cymbal", AudioFilename(""), "", Some(CRASH_CYMBAL_1)))))
    val drumSamples = getDrumSamples(beats)

    //assert
    drumSamples.count(x => x.drumCategory == Snare) shouldBe 1
    drumSamples.count(x => x.drumCategory == Kick) shouldBe 1
  }
}
