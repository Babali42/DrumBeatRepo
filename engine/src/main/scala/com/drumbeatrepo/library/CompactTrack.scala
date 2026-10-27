package com.drumbeatrepo.library

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

final case class CompactTrack(
    name: String,
    filename: String,
    steps: String,
    isMuted: Option[Boolean] = None,
    isSolo: Option[Boolean] = None,
    midiNote: Option[Int] = None
)

given Decoder[CompactTrack] = deriveDecoder[CompactTrack]
