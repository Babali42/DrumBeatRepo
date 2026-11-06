package com.drumbeatrepo.sequencer

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

final case class Track(
    name: String,
    filename: String,
    steps: String,
    isMuted: Option[Boolean] = None,
    isSolo: Option[Boolean] = None,
    midiNote: Option[MidiDrumType] = None
)

given Decoder[Track] = deriveDecoder[Track]
