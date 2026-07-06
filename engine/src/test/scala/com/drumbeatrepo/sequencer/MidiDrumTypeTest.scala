package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalacheck.*
import org.scalacheck.Gen
import org.scalatest.matchers.should.Matchers.*
import org.scalatestplus.scalacheck.ScalaCheckPropertyChecks.*

class MidiDrumTypeSpec extends AnyFunSuite:

  test("all MIDI note numbers are within the General MIDI drum range"):
    forAll(Gen.oneOf(MidiDrumType.values.toSeq)) { drum =>
      drum.midiNote should be >= 35
      drum.midiNote should be <= 81
    }

  test("MIDI note numbers are unique"):
    val notes = MidiDrumType.values.map(_.midiNote)
    notes.distinct should have size notes.length

  test("fromMidiNote is the inverse of midiNote"):
    forAll(Gen.oneOf(MidiDrumType.values.toSeq)) { drum =>
      MidiDrumType.fromMidiNote(drum.midiNote) shouldBe Some(drum)
    }

  test("invalid MIDI note numbers are rejected"):
    val invalid =
      Gen
        .oneOf(
          Gen.choose(Int.MinValue, 34),
          Gen.choose(82, Int.MaxValue)
        )
        .flatMap(identity)

    forAll(invalid) { note =>
      MidiDrumType.fromMidiNote(note) shouldBe None
    }
