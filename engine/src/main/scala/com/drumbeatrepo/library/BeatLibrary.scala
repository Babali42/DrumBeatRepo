package com.drumbeatrepo.library

import cats.effect.IO
import io.circe.parser.decode
import org.scalajs.dom.Fetch
import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.*
import cats.effect.unsafe.implicits.global
import scala.concurrent.ExecutionContext.Implicits.global

@JSExportTopLevel("BeatLibrary")
object BeatLibrary:
  @JSExport
  def loadBeatsManifest(): js.Promise[js.Array[js.Object]] =
    BeatsClient.load
      .map(_.map(BeatMetadata.toJS).toJSArray)
      .unsafeToFuture()
      .toJSPromise

object BeatsClient {
  def load: IO[List[BeatMetadata]] =
    for
      response <- IO.fromFuture(IO(Fetch.fetch("/assets/beats/beats-metadata.json").toFuture))
      text     <- IO.fromFuture(IO(response.text().toFuture))
      beats    <- IO.fromEither(BeatParser.parseManifest(text))
    yield beats
}

object BeatParser {
  def parseManifest(jsonText: String): Either[io.circe.Error, List[BeatMetadata]] =
    decode[List[BeatMetadata]](jsonText)
}