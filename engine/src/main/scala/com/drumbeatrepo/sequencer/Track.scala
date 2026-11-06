package com.drumbeatrepo.sequencer

import io.circe.Decoder
import io.circe.DecodingFailure

final case class Track(
    name: String,
    filename: String,
    steps: String,
    isMuted: Option[Boolean] = None,
    isSolo: Option[Boolean] = None,
    midiNote: Option[MidiDrumType] = None
)

implicit val decodeFoo: Decoder[Track] =
  Decoder.instance { c =>
    for {
      name <- c.get[String]("name")
      filename <- c.get[String]("filename")
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
    } yield Track(name, filename, steps, isMuted, isSolo, midiNote)
  }
