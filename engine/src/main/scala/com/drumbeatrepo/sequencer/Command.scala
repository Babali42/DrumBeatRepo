package com.drumbeatrepo.sequencer

import scala.scalajs.js

enum Command:
  case SelectBeat(genre: String, beat: String, tempo: Int)
  case SetTempo(tempo: Int)
  case Undo
  case Redo

object Command:
  def fromJS(cmd: js.Dynamic): Command =
    cmd.selectDynamic("type").asInstanceOf[String] match
      case "SELECT_BEAT" =>
        SelectBeat(
          cmd
            .selectDynamic("payload")
            .selectDynamic("genre")
            .asInstanceOf[String],
          cmd
            .selectDynamic("payload")
            .selectDynamic("beat")
            .asInstanceOf[String],
          cmd
            .selectDynamic("payload")
            .selectDynamic("tempo")
            .asInstanceOf[Int]
        )
      case "SET_TEMPO" =>
        SetTempo(
          cmd
            .selectDynamic("payload")
            .selectDynamic("tempo")
            .asInstanceOf[Int]
        )
      case "UNDO" => Undo
      case "REDO" => Redo
      case t      => throw new RuntimeException(s"Unknown command: $t")
