package scala.com.drumbeatrepo.sequencer

import scala.scalajs.js

enum Command:
  case SelectGenre(genre: String)
  case SelectBeat(beat: String)
  case Undo
  case Redo

object Command:
  def fromJS(cmd: js.Dynamic): Command =
    cmd.selectDynamic("type").asInstanceOf[String] match
      case "SELECT_GENRE" =>
        SelectGenre(
          cmd
            .selectDynamic("payload")
            .selectDynamic("genre")
            .asInstanceOf[String]
        )
      case "SELECT_BEAT" =>
        SelectBeat(
          cmd
            .selectDynamic("payload")
            .selectDynamic("beat")
            .asInstanceOf[String]
        )
      case "UNDO"      => Undo
      case "REDO"      => Redo
      case t           => throw new RuntimeException(s"Unknown command: $t")
