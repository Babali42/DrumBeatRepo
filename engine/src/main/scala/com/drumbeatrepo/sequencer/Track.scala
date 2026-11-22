package com.drumbeatrepo.sequencer

import io.circe.Decoder
import io.circe.DecodingFailure

final case class Track(name: String, filename: AudioFilename, steps: String, midiNote: Option[MidiDrumType] = None, isSolo: Option[Boolean] = None, isMuted: Option[Boolean] = None)

implicit val decodeFoo: Decoder[Track] =
  Decoder.instance { c =>
    for {
      name <- c.get[String]("name")
      filename <- c.get[AudioFilename]("filename")
      steps <- c.get[String]("steps").flatMap { value =>
        Either.cond(
          List(4, 8, 12, 16, 32, 64).contains(value.length),
          value,
          DecodingFailure("Invalid step number", c.history)
        )
      }
      isMuted <- c.get[Option[Boolean]]("isMuted")
      isSolo <- c.get[Option[Boolean]]("isSolo")
      midiNote <- c.get[Option[MidiDrumType]]("midiNote")
    } yield Track(name, filename, steps, midiNote, isSolo, isMuted)
  }
