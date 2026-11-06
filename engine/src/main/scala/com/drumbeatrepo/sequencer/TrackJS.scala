package com.drumbeatrepo.sequencer

import scala.scalajs.js

final case class TrackJS(
    name: String,
    filename: String,
    midiNote: Option[MidiDrumType],
    steps: List[Velocity],
    isMuted: Boolean,
    isSolo: Boolean
) extends Ordered[TrackJS] {
  override def compare(that: TrackJS): Int =
    java.lang.Integer
      .compare(
        MidiDrumType.toInt(midiNote.getOrElse(MidiDrumType.OPEN_TRIANGLE)),
        MidiDrumType.toInt(that.midiNote.getOrElse(MidiDrumType.OPEN_TRIANGLE))
      )
}

object TrackJS:
  def fromJS(track: js.Dynamic): TrackJS =
    val midiNoteValue = track.selectDynamic("midiNote")
    val midiNote =
      if js.isUndefined(midiNoteValue) || midiNoteValue == null then
        Option.empty[MidiDrumType]
      else MidiDrumType.fromInt(midiNoteValue.asInstanceOf[Int])
    TrackJS(
      track.selectDynamic("name").asInstanceOf[String],
      track.selectDynamic("filename").asInstanceOf[String],
      midiNote,
      track
        .selectDynamic("steps")
        .asInstanceOf[js.Array[Boolean]]
        .map(Velocity.fromBoolean)
        .toList,
      track.selectDynamic("isMuted").asInstanceOf[Boolean],
      track.selectDynamic("isSolo").asInstanceOf[Boolean]
    )

  def toJS(track: TrackJS): js.Object =
    val stepsArr = new js.Array[Boolean]()
    track.steps.foreach(s => stepsArr.push(s.value > 0))
    val midiNoteVal: js.Any = track.midiNote match
      case Some(note) => note.midiNote
      case None       => null
    js.Dynamic.literal(
      name = track.name,
      filename = track.filename,
      steps = stepsArr,
      midiNote = midiNoteVal,
      isMuted = track.isMuted,
      isSolo = track.isSolo
    )
