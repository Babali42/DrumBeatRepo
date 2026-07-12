package com.drumbeatrepo.sequencer

import scala.scalajs.js
import scala.scalajs.js.JSConverters.*

case class Track(
    name: String,
    fileName: String,
    midiNote: Option[MidiDrumType],
    steps: List[Velocity]
)

object Track:
  def fromJS(track: js.Dynamic): Track =
    val midiNoteValue = track.selectDynamic("midiNote")
    val midiNote =
      if js.isUndefined(midiNoteValue) || midiNoteValue == null then
        Option.empty[MidiDrumType]
      else MidiDrumType.fromMidiNote(midiNoteValue.asInstanceOf[Int])
    Track(
      track.selectDynamic("name").asInstanceOf[String],
      track.selectDynamic("fileName").asInstanceOf[String],
      midiNote,
      track.selectDynamic("steps").asInstanceOf[js.Array[Boolean]].map(Velocity.fromBoolean).toList
    )

  def toJS(track: Track): js.Object =
    val stepsArr = new js.Array[Boolean]()
    track.steps.foreach(s => stepsArr.push(s.value > 0))
    val midiNoteVal: js.Any = track.midiNote match
      case Some(note) => note.midiNote
      case None       => null
    js.Dynamic.literal(
      name = track.name,
      fileName = track.fileName,
      steps = stepsArr,
      midiNote = midiNoteVal
    )
