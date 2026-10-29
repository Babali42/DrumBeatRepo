package com.drumbeatrepo.library

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import com.drumbeatrepo.domain.MidiDrumType

final case class CompactTrack(
    name: String,
    filename: String,
    steps: String,
    isMuted: Option[Boolean] = None,
    isSolo: Option[Boolean] = None,
    midiNote: Option[MidiDrumType] = None
)

given Decoder[CompactTrack] = deriveDecoder[CompactTrack]
given Decoder[MidiDrumType] = deriveDecoder[MidiDrumType]
