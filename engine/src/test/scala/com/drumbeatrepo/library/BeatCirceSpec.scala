package com.drumbeatrepo.library

import io.circe.parser.decode
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

//WIP
//see frontend/src/app/infrastructure/adapters/beat-source/compact-beat.mapper.spec.ts for the remaining tests to add
class CompactBeatCirceSpec extends AnyFlatSpec with Matchers {
  it should "decode valid JSON back into a Beat" in {
    // Arrange
    val json =
      """ |{
          |  "label": "Metal",
          |  "genre": "Metal",
          |  "bpm": 180,
          |  "beatsPerBar": 4,
          |  "subdivisionsPerBeat": 4,
          |  "numberOfBar": 2,
          |  "tracks": [
          |    {
          |      "name": "Snare",
          |      "isMuted": true,
          |      "isSolo": true,
          |      "filename": "metal/snare.mp3",
          |      "steps": "____X_______X___"
          |    },
          |    {
          |      "name": "Hats",
          |      "filename": "metal/crash.mp3",
          |      "steps": "X___X___X___X___"
          |    },
          |    {
          |      "name": "Kick",
          |      "filename": "metal/kick.mp3",
          |      "steps": "XXXXXXXXXXXXXXXX"
          |    }
          |  ]
          |}""".stripMargin

    // Act
    val result = decode[Beat](json)

    // Assert
    result shouldEqual Right(
      Beat(
        label = "Metal",
        genre = "Metal",
        bpm = 180,
        beatsPerBar = 4,
        subdivisionsPerBeat = 4,
        numberOfBar = 2,
        tracks = List(
          Track(
            name = "Snare",
            isMuted = Some(true),
            isSolo = Some(true),
            filename = "metal/snare.mp3",
            steps = "____X_______X___"
          ),
          Track(
            name = "Hats",
            filename = "metal/crash.mp3",
            steps = "X___X___X___X___"
          ),
          Track(
            name = "Kick",
            filename = "metal/kick.mp3",
            steps = "XXXXXXXXXXXXXXXX"
          )
        )
      )
    )
  }
}
