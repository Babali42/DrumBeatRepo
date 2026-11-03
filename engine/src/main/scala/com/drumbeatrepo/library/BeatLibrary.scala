package com.drumbeatrepo.library

import cats.effect.IO
import io.circe.parser.decode
import org.scalajs.dom.Fetch
import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.*
import cats.effect.unsafe.implicits.global
import scala.concurrent.ExecutionContext.Implicits.global

// 1. INBOUND ADAPTER / EXPOSED JS API
// Leave this at the top layer to bridge the JS world to Scala
@JSExportTopLevel("BeatLibrary")
object BeatLibrary:
  @JSExport
  def loadBeatsManifest(): js.Promise[js.Array[js.Object]] =
    BeatsClient.load
      .map(_.map(BeatMetadata.toJS).toJSArray)
      .unsafeToFuture()
      .toJSPromise

// 2. INFRASTRUCTURE / CLIENT
// This handles the browser-specific Fetch API.
object BeatsClient {
  def load: IO[List[BeatMetadata]] =
    for
      response <- IO.fromFuture(IO(Fetch.fetch("/assets/beats/beats-metadata.json").toFuture))
      text     <- IO.fromFuture(IO(response.text().toFuture))
      // The actual domain parsing is delegated to a pure function
      beats    <- IO.fromEither(BeatParser.parseManifest(text))
    yield beats
}

// 3. PURE DOMAIN / COGNITIVE CORE
// This contains zero browser logic, zero Fetch, and zero IO. 
// It is 100% unit-testable with plain strings.
object BeatParser {
  def parseManifest(jsonText: String): Either[io.circe.Error, List[BeatMetadata]] =
    decode[List[BeatMetadata]](jsonText)
}