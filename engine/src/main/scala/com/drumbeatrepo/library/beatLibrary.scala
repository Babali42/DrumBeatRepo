package com.drumbeatrepo.library

import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.*
import cats.effect.IO
import org.scalajs.dom.Fetch
import io.circe.parser.decode
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax._
import cats.effect.unsafe.implicits.global
import scala.concurrent.ExecutionContext.Implicits.global
import scala.scalajs.js.JSConverters._

@JSExportTopLevel("BeatLibrary")
object beatLibrary:

  @JSExport
  def loadBeatsManifest(): js.Promise[js.Array[js.Object]] =
    Beats.load
      .map(_.map(BeatMetadata.toJS).toJSArray)
      .unsafeToFuture()
      .toJSPromise

object Beats {
  def load: IO[List[BeatMetadata]] =
    IO.fromFuture(IO(Fetch.fetch("/assets/beats/beats-metadata.json").toFuture))
      .flatMap(resp => IO.fromFuture(IO(resp.text().toFuture)))
      .flatMap { text =>
        IO.fromEither(decode[List[BeatMetadata]](text))
      }
}

final case class BeatMetadata(
    genre: String,
    label: String,
    filename: String
)

object BeatMetadata:
  // semi-auto derivation keeps things explicit and avoids
  // pulling in generic.auto (which derives everywhere implicitly)
  given Decoder[BeatMetadata] = deriveDecoder[BeatMetadata]

  def toJS(beatMetadata: BeatMetadata): js.Object =
    js.Dynamic.literal(
      genre = beatMetadata.genre,
      label = beatMetadata.label,
      filename = beatMetadata.filename
    )
end BeatMetadata
