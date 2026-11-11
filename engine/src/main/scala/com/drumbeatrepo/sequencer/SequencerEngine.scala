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

  private def dispatchIO(command: Command): IO[Unit] = {

    val beatLoader = new HttpBeatLoader();

    state.execute(command, beatLoader).map { newState =>
      command match
        case Command.Undo | Command.Redo =>
          state = newState
        case _ =>
          state = newState.copy(future = Nil)
    }
  }

  def dispatch(command: Command): js.Promise[Unit] =
    dispatchIO(command).unsafeToFuture().toJSPromise

  @JSExport
  def dispatch(cmd: js.Dynamic): js.Promise[Unit] =
    dispatch(Command.fromJS(cmd))

  @JSExport
  def reset(): Unit =
    state = SequencerState.initial

  //Accessor-like method has empty parameter clause -> ignore this warning, it breaks the contract with ts
  @JSExport
  def getState(): js.Object =
    js.Dynamic.literal(
      genre = state.genre,
      beat = state.beat,
      tracks = state.tracks.sorted.reverse.map(TrackJS.toJS).toJSArray,
      tempo = state.tempo,
      beatsPerBar = state.beatsPerBar,
      subdivisionsPerBeat = state.subdivisionsPerBeat,
      numberOfBar = state.numberOfBar,
      historyLength = state.history.length,
      futureLength = state.future.length
    )
