package com.drumbeatrepo.library

import io.circe.parser.decode
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class BeatMetadataCirceSpec extends AnyFlatSpec with Matchers {
  it should "decode valid JSON back into a BeatMetadata" in {
    val json =
      """{"genre":"Techno","label":"Tresor","filename":"kick.wav","bpm":140.5}"""

    decode[BeatMetadata](json) shouldEqual
      Right(BeatMetadata("Techno", "Tresor", "kick.wav"))
  }

  it should "fail to decode JSON missing a required field" in {
    val json = """{"genre":"Techno","filename":"kick.wav"}""" // missing "label"

    decode[BeatMetadata](json).isLeft shouldBe true
  }

  it should "decode Bossa Nova metadata correctly" in {
    val json =
      """{"genre":"Bossa Nova","label":"Bossa Nova","filename":"bossa-nova/bossa-nova"}"""

    decode[BeatMetadata](json) shouldEqual
      Right(BeatMetadata("Bossa Nova", "Bossa Nova", "bossa-nova/bossa-nova"))
  }
}
