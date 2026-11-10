package com.drumbeatrepo.sequencer

import io.circe.Decoder

opaque type AudioFilename = String

private[sequencer] object AudioRules:
  // One path segment: no leading dot/whitespace, no dots or forbidden chars anywhere
  val segment = """[^.\s\\/:"*?<>|][^.\\/:"*?<>|]*"""
  val extension = "(mp3|wav)"

object AudioFilename:
  private val pattern =
    raw"""(${AudioRules.segment}/)*${AudioRules.segment}\.${AudioRules.extension}""".r

  def from(value: String): Either[String, AudioFilename] =
    Either.cond(pattern.matches(value), value, "Invalid audio file path")

  def apply(value: String): AudioFilename = value

  extension (filename: AudioFilename) def value: String = filename

  given Decoder[AudioFilename] =
    Decoder.decodeString.emap(from)
