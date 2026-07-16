package com.drumbeatrepo.sequencer

import scala.scalajs.js

enum Command:
  case SelectBeat(genre: String, beat: String, tracks: List[Track], tempo: Int)
  case SetTempo(tempo: Int)
  case ToggleStep(trackName: String, stepIndex: Int)
  case SetSteps(
      trackName: String,
      fromStepIndex: Int,
      toStepIndex: Int,
      velocity: Velocity
  )
  case AddTrack(track: Track)
  case Undo
  case Redo

object Command:
  def fromJS(cmd: js.Dynamic): Command =
    cmd.selectDynamic("type").asInstanceOf[String] match
      case "SELECT_BEAT" =>
        val payload = cmd.selectDynamic("payload")
        val tracksJS = payload.selectDynamic("tracks")
        val tracks =
          if js.isUndefined(tracksJS) || tracksJS == null then List.empty[Track]
          else
            val arr = tracksJS.asInstanceOf[js.Array[js.Dynamic]]
            (0 until arr.length).map(i => Track.fromJS(arr(i))).toList
        SelectBeat(
          payload.selectDynamic("genre").asInstanceOf[String],
          payload.selectDynamic("beat").asInstanceOf[String],
          tracks,
          payload.selectDynamic("tempo").asInstanceOf[Int]
        )
      case "SET_TEMPO" =>
        SetTempo(
          cmd
            .selectDynamic("payload")
            .selectDynamic("tempo")
            .asInstanceOf[Int]
        )
      case "TOGGLE_STEP" =>
        val payload = cmd.selectDynamic("payload")
        ToggleStep(
          payload.selectDynamic("trackName").asInstanceOf[String],
          payload.selectDynamic("stepIndex").asInstanceOf[Int]
        )
      case "SET_STEPS" =>
        val payload = cmd.selectDynamic("payload")
        SetSteps(
          payload.selectDynamic("trackName").asInstanceOf[String],
          payload.selectDynamic("fromStepIndex").asInstanceOf[Int],
          payload.selectDynamic("toStepIndex").asInstanceOf[Int],
          Velocity.fromBoolean(
            payload
              .selectDynamic("velocity")
              .asInstanceOf[Boolean]
          )
        )
      case "UNDO" => Undo
      case "REDO" => Redo
      case t      => throw new RuntimeException(s"Unknown command: $t")
