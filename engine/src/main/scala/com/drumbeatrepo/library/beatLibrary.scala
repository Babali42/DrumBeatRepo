package com.drumbeatrepo.library

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import io.circe.Decoder
import io.circe.parser.decode
import org.scalajs.dom.Fetch

import scala.concurrent.ExecutionContext.Implicits.global
import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.*

@JSExportTopLevel("BeatLibrary")
object BeatLibrary:

  @JSExport
  def loadBeatsManifest(): js.Promise[js.Array[js.Object]] =
    Beats.load
      .map(_.map(BeatMetadata.toJS).toJSArray)
      .unsafeToFuture()
      .toJSPromise

object Beats {
  def load: IO[List[BeatMetadata]] =
    for
      response <- IO.fromFuture(
        IO(Fetch.fetch("/assets/beats/beats-metadata.json").toFuture)
      )
      text <- IO.fromFuture(IO(response.text().toFuture))
      beats <- IO.fromEither(decode[List[BeatMetadata]](text))
    yield beats
}
