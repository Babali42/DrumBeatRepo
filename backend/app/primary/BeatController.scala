package primary

import domain.{Beat, Track}
import play.api.libs.json._
import play.api.mvc._
import secondary.repositoryFactory.BeatRepositoryFactory

import javax.inject.{Inject, Singleton}
import scala.concurrent.ExecutionContext

@Singleton class BeatController @Inject()(val controllerComponents: ControllerComponents, val factory: BeatRepositoryFactory)(implicit ec: ExecutionContext) extends BaseController {

  def getBeats: Action[AnyContent] = Action.async { _ =>
    val connectionString = sys.env.getOrElse("DATABASE_CONNECTION_STRING", "mongodb://admin:pass@localhost:27017")
    val repository = factory.createMongoRepository(connectionString, "drum-beat-database")

    repository.getAllBeats.map { documents =>
      implicit val trackFormat: Format[Track] = Json.format[Track]
      implicit val beatWrites: OWrites[Beat] = Json.writes[Beat]
      val beats = documents.map(x => Json.toJson(x))
      Ok(Json.toJson(beats))
    }.recover { case ex: Throwable => InternalServerError(s"Error fetching beats: ${ex.getMessage}")
    }
  }
}
