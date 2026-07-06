package com.drumbeatrepo.sequencer

case class Track(
    name: String,
    fileName: String,
    midiNote: Int, // TODO model midi notes in scala
    steps: List[Boolean],
    numberOfSteps: Int // TODO model number of steps
)
