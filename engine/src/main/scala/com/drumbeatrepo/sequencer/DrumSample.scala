package com.drumbeatrepo.sequencer

import scala.scalajs.js

case class DrumSample(name: String, filename: AudioFilename, midiDrumType: MidiDrumType, drumCategory: DrumCategory)

object DrumSample {
  def toJS(drumSample: DrumSample): js.Object =
    js.Dynamic.literal(
      name = drumSample.name,
      filename = drumSample.filename.toString,
      midinote = drumSample.midiDrumType.midiNote,
      drumCategory = drumSample.drumCategory.toString
    )

  def getDrumSamples(beats: List[Beat]): List[DrumSample] = {
    for {
      beat <- beats
      track <- beat.tracks
      midiNote <- track.midiNote
      category <- midiDrumTypeToDrumCategoryMap.get(midiNote)
    } yield DrumSample(track.name, track.filename, midiNote, category)
  }
}

enum DrumCategory:
  case Kick
  case Snare
  case HiHat
  case Tom
  case Cymbal
  case Percussion

private val midiDrumTypeToDrumCategoryMap: Map[MidiDrumType, DrumCategory] =
  Map(
    // Kick
    MidiDrumType.BASS_DRUM_1 -> DrumCategory.Kick,
    MidiDrumType.ACOUSTIC_BASS_DRUM -> DrumCategory.Kick,

    // Snare
    MidiDrumType.SIDE_STICK -> DrumCategory.Snare,
    MidiDrumType.ACOUSTIC_SNARE -> DrumCategory.Snare,
    MidiDrumType.HAND_CLAP -> DrumCategory.Snare,
    MidiDrumType.ELECTRIC_SNARE -> DrumCategory.Snare,

    // HiHat
    MidiDrumType.CLOSED_HI_HAT -> DrumCategory.HiHat,
    MidiDrumType.PEDAL_HI_HAT -> DrumCategory.HiHat,
    MidiDrumType.OPEN_HI_HAT -> DrumCategory.HiHat,

    // Tom
    MidiDrumType.LOW_FLOOR_TOM -> DrumCategory.Tom,
    MidiDrumType.HIGH_FLOOR_TOM -> DrumCategory.Tom,
    MidiDrumType.LOW_TOM -> DrumCategory.Tom,
    MidiDrumType.LOW_MID_TOM -> DrumCategory.Tom,
    MidiDrumType.HI_MID_TOM -> DrumCategory.Tom,
    MidiDrumType.HIGH_TOM -> DrumCategory.Tom,

    // Cymbal
    MidiDrumType.CRASH_CYMBAL_1 -> DrumCategory.Cymbal,
    MidiDrumType.RIDE_CYMBAL_1 -> DrumCategory.Cymbal,
    MidiDrumType.CHINESE_CYMBAL -> DrumCategory.Cymbal,
    MidiDrumType.SPLASH_CYMBAL -> DrumCategory.Cymbal,
    MidiDrumType.CRASH_CYMBAL_2 -> DrumCategory.Cymbal,
    MidiDrumType.RIDE_CYMBAL_2 -> DrumCategory.Cymbal,
    MidiDrumType.RIDE_BELL -> DrumCategory.Cymbal,

    // Percussion
    MidiDrumType.TAMBOURINE -> DrumCategory.Percussion,
    MidiDrumType.COWBELL -> DrumCategory.Percussion,
    MidiDrumType.VIBRASLAP -> DrumCategory.Percussion,
    MidiDrumType.HI_BONGO -> DrumCategory.Percussion,
    MidiDrumType.LOW_BONGO -> DrumCategory.Percussion,
    MidiDrumType.MUTE_HI_CONGA -> DrumCategory.Percussion,
    MidiDrumType.OPEN_HI_CONGA -> DrumCategory.Percussion,
    MidiDrumType.LOW_CONGA -> DrumCategory.Percussion,
    MidiDrumType.HIGH_TIMBALE -> DrumCategory.Percussion,
    MidiDrumType.LOW_TIMBALE -> DrumCategory.Percussion,
    MidiDrumType.HIGH_AGOGO -> DrumCategory.Percussion,
    MidiDrumType.LOW_AGOGO -> DrumCategory.Percussion,
    MidiDrumType.CABASA -> DrumCategory.Percussion,
    MidiDrumType.MARACAS -> DrumCategory.Percussion,
    MidiDrumType.SHORT_WHISTLE -> DrumCategory.Percussion,
    MidiDrumType.LONG_WHISTLE -> DrumCategory.Percussion,
    MidiDrumType.SHORT_GUIRO -> DrumCategory.Percussion,
    MidiDrumType.LONG_GUIRO -> DrumCategory.Percussion,
    MidiDrumType.CLAVES -> DrumCategory.Percussion,
    MidiDrumType.HI_WOOD_BLOCK -> DrumCategory.Percussion,
    MidiDrumType.LOW_WOOD_BLOCK -> DrumCategory.Percussion,
    MidiDrumType.MUTE_CUICA -> DrumCategory.Percussion,
    MidiDrumType.OPEN_CUICA -> DrumCategory.Percussion,
    MidiDrumType.MUTE_TRIANGLE -> DrumCategory.Percussion,
    MidiDrumType.OPEN_TRIANGLE -> DrumCategory.Percussion
  )
