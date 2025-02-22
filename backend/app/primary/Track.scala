package primary

import play.api.libs.json.{JsResult, JsValue, Reads}

case class Track(name: String, fileName: String, steps: String)

object Track {
  implicit val readsMyClass: Reads[Track] = new Reads[Track] {
    def reads(json: JsValue): JsResult[Track] = {
      for {
        name <- (json \ "name").validate[String]
        fileName <- (json \ "fileName").validate[String]
        steps <- (json \ "steps").validate[String]
      } yield Track(name, fileName, steps)
    }
  }
}