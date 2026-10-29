package com.drumbeatrepo.sequencer

import cats.effect.IO
import cats.effect.unsafe.implicits.global

import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.*

implicit val ec: scala.concurrent.ExecutionContext =
  scala.concurrent.ExecutionContext.global

@JSExportTopLevel("SequencerEngine")
object SequencerEngine:
  private var state: SequencerState = SequencerState.initial

  private def dispatchIO(command: Command): IO[Unit] =
    state.dispatch(command).map { newState =>
      command match
        case Command.Undo | Command.Redo =>
          state = newState
        case _ =>
          state = newState.copy(future = Nil)
    }

  def dispatch(command: Command): js.Promise[Unit] =
    dispatchIO(command).unsafeToFuture().toJSPromise

  @JSExport
  def dispatch(cmd: js.Dynamic): js.Promise[Unit] =
    dispatch(Command.fromJS(cmd))

  @JSExport
  def reset(): Unit =
    state = SequencerState.initial

  @JSExport
  def getState(): js.Object =
    js.Dynamic.literal(
      genre = state.genre,
      beat = state.beat,
      tracks = state.tracks.sorted.reverse.map(Track.toJS).toJSArray,
      tempo = state.tempo,
      beatsPerBar = state.beatsPerBar,
      subdivisionsPerBeat = state.subdivisionsPerBeat,
      numberOfBars = state.numberOfBars,
      historyLength = state.history.length,
      futureLength = state.future.length
    )
