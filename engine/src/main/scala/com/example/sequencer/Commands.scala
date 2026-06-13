package com.example.sequencer

import scala.scalajs.js

enum Command:
  case ToggleStep(index: Int)
  case SetCurrentStep(index: Int)
  case ClearAll
  case Undo
  case Redo

object Command:
  def fromJS(cmd: js.Dynamic): Command =
    cmd.selectDynamic("type").asInstanceOf[String] match
      case "TOGGLE_STEP"      => ToggleStep(cmd.selectDynamic("payload").selectDynamic("index").asInstanceOf[Int])
      case "SET_CURRENT_STEP" => SetCurrentStep(cmd.selectDynamic("payload").selectDynamic("index").asInstanceOf[Int])
      case "CLEAR_ALL"        => ClearAll
      case "UNDO"             => Undo
      case "REDO"             => Redo
      case t                  => throw new RuntimeException(s"Unknown command: $t")
