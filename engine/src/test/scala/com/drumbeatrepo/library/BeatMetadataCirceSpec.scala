import io.circe.parser.decode
import io.circe.syntax._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.{Encoder, Decoder}
import io.circe.generic.semiauto.{deriveEncoder, deriveDecoder}

class BeatMetadataCirceSpec extends AnyFlatSpec with Matchers {

  "BeatMetadata" should "encode to the expected JSON" in {
    val beat = BeatMetadata(
      genre = "Deep House",
      label = "Kompakt",
      filename = "track01.wav",
      bpm = Some(124.0)
    )

    val json = beat.asJson.noSpaces

    json shouldEqual
      """{"genre":"Deep House","label":"Kompakt","filename":"track01.wav","bpm":124.0}"""
  }

  it should "omit bpm entirely when None" in {
    val beat = BeatMetadata(
      genre = "Ambient",
      label = "Ghostly",
      filename = "loop.wav",
      bpm = None
    )

    beat.asJson.noSpaces shouldEqual
      """{"genre":"Ambient","label":"Ghostly","filename":"loop.wav"}"""
  }

  it should "decode valid JSON back into a BeatMetadata" in {
    val json =
      """{"genre":"Techno","label":"Tresor","filename":"kick.wav","bpm":140.5}"""

    decode[BeatMetadata](json) shouldEqual
      Right(BeatMetadata("Techno", "Tresor", "kick.wav", Some(140.5)))
  }

  it should "decode JSON missing bpm as None" in {
    val json = """{"genre":"Techno","label":"Tresor","filename":"kick.wav"}"""

    decode[BeatMetadata](json) shouldEqual
      Right(BeatMetadata("Techno", "Tresor", "kick.wav", None))
  }

  it should "round-trip encode -> decode back to the original value" in {
    val beat = BeatMetadata("House", "Defected", "groove.wav", Some(122.0))

    decode[BeatMetadata](beat.asJson.noSpaces) shouldEqual Right(beat)
  }

  it should "fail to decode JSON missing a required field" in {
    val json = """{"genre":"Techno","filename":"kick.wav"}""" // missing "label"

    decode[BeatMetadata](json) shouldBe a[Left[_, _]]
  }
}

final case class BeatMetadata(
    genre: String,
    label: String,
    filename: String,
    bpm: Option[Double] = None
)

object BeatMetadata:
  // semi-auto derivation keeps things explicit and avoids
  // pulling in generic.auto (which derives everywhere implicitly)
  given Encoder[BeatMetadata] = deriveEncoder[BeatMetadata]
  given Decoder[BeatMetadata] = deriveDecoder[BeatMetadata]
