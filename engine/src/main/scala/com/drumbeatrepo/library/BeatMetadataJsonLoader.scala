package com.drumbeatrepo.library

import cats.effect.IO
import org.scalajs.dom.Fetch
import io.circe.parser.decode

object Beats {
  def load: IO[BeatMetadata] =
    IO.fromFuture(IO(Fetch.fetch("/assets/beat-metadata.json").toFuture))
      .flatMap(resp => IO.fromFuture(IO(resp.text().toFuture)))
      .flatMap { text =>
        IO.fromEither(decode[BeatMetadata](text))
      }
}
