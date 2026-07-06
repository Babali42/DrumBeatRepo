package com.drumbeatrepo.sequencer
import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.*

@JSExportTopLevel("SequencerEngine")
object SequencerEngine:
  private var state: SequencerState = SequencerState.initial

  @JSExport
  def dispatch(cmd: js.Dynamic): Unit =
    val command = Command.fromJS(cmd)
    command match
      case Command.Undo | Command.Redo => state = state.dispatch(command)
      case _ => state = state.dispatch(command).copy(future = Nil)

  @JSExport
  def reset(): Unit =
    state = SequencerState.initial

  @JSExport
  def getState(): js.Object =
    js.Dynamic.literal(
      genre = state.genre,
      beat = state.beat,
      tracks = state.tracks.map(Track.toJS).toJSArray,
      tempo = state.tempo,
      historyLength = state.history.length,
      futureLength = state.future.length
    )
