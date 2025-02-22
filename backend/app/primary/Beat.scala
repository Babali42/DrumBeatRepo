package primary

import play.api.libs.json._

case class Beat(id: String, label: String, bpm: Int, genre: String, tracks: Seq[Track])

object Beat {
  implicit val readsMyClass: Reads[Beat] = new Reads[Beat] {
    def reads(json: JsValue): JsResult[Beat] = {
      for {
        id <- (json \ "id").validate[String]
        label <- (json \ "label").validate[String]
        bpm <- (json \ "bpm").validate[Int]
        genre <- (json \ "genre").validate[String]
        tracks <- (json \ "tracks").validate[Seq[Track]]
      } yield Beat(id, label, bpm, genre, tracks)
    }
  }
}