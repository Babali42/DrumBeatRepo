package com.drumbeatrepo.sequencer

import cats.effect.IO
import com.drumbeatrepo.library.Beat
import org.scalajs.dom.Fetch
import io.circe.parser.decode
import io.circe.generic.auto.deriveDecoder

final class HttpBeatLoader extends BeatLoader:

  override def load(filename: String): IO[Beat] =
    for
      response <- IO.fromFuture(
        IO(Fetch.fetch(s"/assets/beats/$filename.json").toFuture)
      )
      text <- IO.fromFuture(IO(response.text().toFuture))
      beat <- IO.fromEither(decode[Beat](text))
    yield beat
