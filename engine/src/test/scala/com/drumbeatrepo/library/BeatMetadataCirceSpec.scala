package com.drumbeatrepo.library

import io.circe.parser.decode
import io.circe.syntax._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.{Encoder, Decoder}
import io.circe.generic.semiauto.{deriveEncoder, deriveDecoder}

class BeatMetadataCirceSpec extends AnyFlatSpec with Matchers {

  "BeatMetadata" should "encode to the expected JSON" in {
    val beat = BeatMetadata(
      genre = "Deep House",
      label = "Kompakt",
      filename = "track01.wav"
    )

    val json = beat.asJson.noSpaces

    json shouldEqual
      """{"genre":"Deep House","label":"Kompakt","filename":"track01.wav"}"""
  }

  it should "decode valid JSON back into a BeatMetadata" in {
    val json =
      """{"genre":"Techno","label":"Tresor","filename":"kick.wav","bpm":140.5}"""

    decode[BeatMetadata](json) shouldEqual
      Right(BeatMetadata("Techno", "Tresor", "kick.wav"))
  }

  it should "round-trip encode -> decode back to the original value" in {
    val beat = BeatMetadata("House", "Defected", "groove.wav")

    decode[BeatMetadata](beat.asJson.noSpaces) shouldEqual Right(beat)
  }

  it should "fail to decode JSON missing a required field" in {
    val json = """{"genre":"Techno","filename":"kick.wav"}""" // missing "label"

    decode[BeatMetadata](json).isLeft shouldBe true
  }
}
