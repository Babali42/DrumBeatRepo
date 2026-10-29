package com.drumbeatrepo.library

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

final case class Beat(
    label: String,
    genre: String,
    bpm: Int,
    beatsPerBar: Int,
    subdivisionsPerBeat: Int,
    numberOfBar: Int,
    tracks: List[Track]
)

given Decoder[Beat] = deriveDecoder[Beat]
