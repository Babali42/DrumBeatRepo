package secondary.repositoryFactory
import domain.{Beat, BeatRepository, Track}

import scala.concurrent.Future

class InMemoryBeatRepositoryFactory extends BeatRepositoryFactory {

  override def createMongoRepository(connectionString: String, databaseName: String): BeatRepository = {
    new BeatRepository {
      override def getAllBeats: Future[Option[Seq[Beat]]] = Future.successful(
        Some(Seq(Beat("0", "Gabber", 180, "Techno", Seq(Track("Kick", "kick.mp3", Seq(true, false, false, false)), Track("Snare", "snare.mp3", Seq(true, false, false, false)))),
          Beat("1", "Roll", 118, "Metal", Seq()))))
    }
  }
}
