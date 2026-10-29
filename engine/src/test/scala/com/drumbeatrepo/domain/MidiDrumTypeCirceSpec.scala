package com.drumbeatrepo.domain

package com.drumbeatrepo.domain

import io.circe.parser.decode
import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers.*

class MidiDrumTypeCirceSpec extends AnyFunSuite:

  test("should decode acoustic snare from its MIDI note string"):
    decode[MidiDrumType]("\"38\"") shouldBe Right(MidiDrumType.ACOUSTIC_SNARE)

  test("should decode bass drum from its MIDI note string"):
    decode[MidiDrumType]("\"36\"") shouldBe Right(MidiDrumType.BASS_DRUM_1)

  test("should decode the lowest supported MIDI note"):
    decode[MidiDrumType]("\"35\"") shouldBe Right(
      MidiDrumType.ACOUSTIC_BASS_DRUM
    )

  test("should decode the highest supported MIDI note"):
    decode[MidiDrumType]("\"81\"") shouldBe Right(MidiDrumType.OPEN_TRIANGLE)

  test("should decode a JSON number"):
    decode[MidiDrumType]("38") shouldBe Right(MidiDrumType.ACOUSTIC_SNARE)

  test("should fail to decode an unknown MIDI note"):
    decode[MidiDrumType]("\"999\"").isLeft shouldBe true

  test("should fail to decode a malformed MIDI note string"):
    decode[MidiDrumType]("\"not-a-note\"").isLeft shouldBe true

  test("should fail to decode a JSON object"):
    decode[MidiDrumType]("{}").isLeft shouldBe true

  test("should fail to decode null"):
    decode[MidiDrumType]("null").isLeft shouldBe true
