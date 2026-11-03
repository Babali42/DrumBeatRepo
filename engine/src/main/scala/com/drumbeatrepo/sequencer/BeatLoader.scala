package com.drumbeatrepo.sequencer

import cats.effect.IO
import com.drumbeatrepo.library.Beat

trait BeatLoader:
  def load(filename: String): IO[Beat]
