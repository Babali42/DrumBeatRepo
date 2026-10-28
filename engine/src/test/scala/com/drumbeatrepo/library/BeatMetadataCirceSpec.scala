package com.drumbeatrepo.library

import io.circe.parser.decode
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

//TODO : add integration tests but it seems complicated

class BeatMetadataCirceSpec extends AnyFlatSpec with Matchers {
  it should "decode valid JSON back into a BeatMetadata" in {
    // Arrange
    val json =
      """|{
         |  "genre": "Techno",
         |  "label": "Tresor",
         |  "filename": "kick.wav"
         |}""".stripMargin

    // Act
    val result = decode[BeatMetadata](json)

    // Assert
    result shouldEqual Right(BeatMetadata("Techno", "Tresor", "kick.wav"))
  }

  it should "fail to decode JSON when a required field is missing" in {
    // Arrange
    val json = """|{
                  |  "genre": "Techno",
                  |  "filename":"kick.wav"
                  |}""".stripMargin // missing "label"

    // Act
    val result = decode[BeatMetadata](json);

    // Assert
    result.isLeft shouldBe true
  }

  it should "decode Bossa Nova metadata" in {
    // Arrange
    val json =
      """|{
         |  "genre": "Bossa Nova",
         |  "label":"Bossa Nova",
         |  "filename":"bossa-nova/bossa-nova"
         |}""".stripMargin

    // Act
    val result = decode[BeatMetadata](json)

    // Assert
    result shouldEqual Right(
      BeatMetadata("Bossa Nova", "Bossa Nova", "bossa-nova/bossa-nova")
    )
  }
}
