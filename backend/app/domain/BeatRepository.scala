package domain

import com.google.inject.ImplementedBy
import secondary.MongoBeatRepository

import scala.concurrent.Future

@ImplementedBy(classOf[MongoBeatRepository])
trait BeatRepository {
  def getAllBeats: Future[Option[Seq[Beat]]]
}
