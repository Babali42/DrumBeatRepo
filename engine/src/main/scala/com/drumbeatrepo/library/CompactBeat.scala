package com.drumbeatrepo.library

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

final case class CompactBeat(
    label: String,
    genre: String,
    bpm: Int,
    beatsPerBar: Int,
    subdivisionsPerBeat: Int,
    numberOfBar: Int,
    tracks: List[CompactTrack]
)

given Decoder[CompactBeat] = deriveDecoder[CompactBeat]
