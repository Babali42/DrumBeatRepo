package com.drumbeatrepo.library

import io.circe.parser.decode
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import com.drumbeatrepo.domain.MidiDrumType

//WIP
//see frontend/src/app/infrastructure/adapters/beat-source/compact-beat.mapper.spec.ts for the remaining tests to add
class CompactBeatCirceSpec extends AnyFlatSpec with Matchers {
  it should "decode valid JSON into a Beat" in {
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
          |      "steps": "____X_______X___",
          |      "midiNote": 38
          |    },
          |    {
          |      "name": "Kick",
          |      "filename": "metal/kick.mp3",
          |      "steps": "XXXXXXXXXXXXXXXX",
          |      "midiNote": 36
          |    },
          |    {
          |      "name": "Bass",
          |      "filename": "metal/bass.mp3",
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
            steps = "____X_______X___",
            midiNote = Some(MidiDrumType.ACOUSTIC_SNARE)
          ),
          Track(
            name = "Kick",
            filename = "metal/kick.mp3",
            steps = "XXXXXXXXXXXXXXXX",
            midiNote = Some(MidiDrumType.BASS_DRUM_1)
          ),
          Track(
            name = "Bass",
            filename = "metal/bass.mp3",
            steps = "XXXXXXXXXXXXXXXX",
            midiNote = None
          )
        )
      )
    )
  }
}
