package com.drumbeatrepo.sequencer

import org.scalatest.funsuite.AnyFunSuite
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

class AudioFilenameSpecs
    extends AnyFunSuite
    with Matchers
    with TableDrivenPropertyChecks:
  private val filenames = Table(
    ("name", "expected"),
    ("test/test.mp3", true),
    ("test/test/test.wav", true),
    ("test/test.flac", false),
    ("test/.mp3", false),
    ("test/ test.mp3", false),
    ("test/te*st.mp3", false),
    ("test/*test.mp3", false),
    ("test/a.b.mp3", false),
    ("test/test.mp3.txt", false)
  )

  test("Should accept mp3 and wav files") {
    forEvery(filenames) { (name, expected) =>
      AudioFilename.from(name).isRight shouldBe expected
    }
  }
