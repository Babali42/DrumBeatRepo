package com.drumbeatrepo.sequencer

import cats.effect.testing.scalatest.AsyncIOSpec
import org.scalatest.matchers.should.Matchers.shouldBe
import org.scalatest.funsuite.AsyncFunSuite

import scala.concurrent.ExecutionContext

class SelectBeatSpec extends AsyncFunSuite with AsyncIOSpec {
  private val initial = SequencerState.initial;

  // todo : add the fileName parameter in the SelectBeat command
  test("dispatch SelectBeat should sets the beat") {
    initial
      // act
      .dispatch(
        Command.SelectBeat("Techno/techno.wav")
      )
      // assert
      .map { after =>
        after.genre shouldBe "Techno";
        after.beat shouldBe "Techno";
        after.tempo shouldBe 128;
        after.beatsPerBar shouldBe 4;
        after.subdivisionsPerBeat shouldBe 4;
        after.numberOfBars shouldBe 1;
      }
      .unsafeToFuture()
  }
}
