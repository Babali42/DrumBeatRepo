package com.drumbeatrepo.sequencer

import cats.effect.IO

trait BeatLoader:
  def load(filename: String): IO[Beat]
  def loadBeats(filenames: List[String]): IO[List[Beat]]
