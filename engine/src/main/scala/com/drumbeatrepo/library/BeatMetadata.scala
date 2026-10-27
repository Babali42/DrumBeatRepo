package com.drumbeatrepo.library

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import scala.scalajs.js

final case class BeatMetadata(
    genre: String,
    label: String,
    filename: String
)

object BeatMetadata {
  // semi-auto derivation keeps things explicit and avoids
  // pulling in generic.auto (which derives everywhere implicitly)
  given Decoder[BeatMetadata] = deriveDecoder[BeatMetadata]

  def toJS(beatMetadata: BeatMetadata): js.Object =
    js.Dynamic.literal(
      genre = beatMetadata.genre,
      label = beatMetadata.label,
      filename = beatMetadata.filename
    )
}
