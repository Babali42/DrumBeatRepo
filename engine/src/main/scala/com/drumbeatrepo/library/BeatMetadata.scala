package com.drumbeatrepo.library

import io.circe.{Encoder, Decoder}
import io.circe.generic.semiauto.{deriveEncoder, deriveDecoder}
import io.circe.syntax._
import io.circe.parser.decode

final case class BeatMetadata(
    genre: String,
    label: String,
    filename: String
)

object BeatMetadata:
  // semi-auto derivation keeps things explicit and avoids
  // pulling in generic.auto (which derives everywhere implicitly)
  given Encoder[BeatMetadata] = deriveEncoder[BeatMetadata]
  given Decoder[BeatMetadata] = deriveDecoder[BeatMetadata]
