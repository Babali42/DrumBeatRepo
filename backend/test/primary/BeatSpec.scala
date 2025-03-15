package primary

import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.must.Matchers.mustBe
import org.scalatest.matchers.should.Matchers

class BeatSpec extends AsyncFlatSpec with Matchers {
  "Primary Beat" should "be created from domain one" in {
    val domainBeat = domain.Beat("0", "Gabber", 180, "Techno",
      Seq(
        domain.Track("Kick", "kick.mp3", Seq(true, false, false, false)),
        domain.Track("Snare", "snare.mp3", Seq(true, false, false, false))))

    val primaryBeat = domainBeat.as[primary.Beat]
    primaryBeat.id mustBe domainBeat.id
    primaryBeat.label mustBe domainBeat.label
    primaryBeat.genre mustBe domainBeat.genre
    primaryBeat.bpm mustBe domainBeat.bpm
    primaryBeat.tracks.head.fileName mustBe domainBeat.tracks.head.fileName
    primaryBeat.tracks.head.name mustBe domainBeat.tracks.head.name
    primaryBeat.tracks.head.steps mustBe domainBeat.tracks.head.steps
  }
}
