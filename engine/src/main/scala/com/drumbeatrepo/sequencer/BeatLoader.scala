package com.drumbeatrepo.sequencer

import cats.effect.IO

trait BeatLoader:
  def load(filename: String): IO[Beat]
