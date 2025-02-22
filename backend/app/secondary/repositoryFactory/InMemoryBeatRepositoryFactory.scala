package secondary.repositoryFactory
import domain.{Beat, BeatRepository, Track}

import scala.concurrent.Future

class InMemoryBeatRepositoryFactory extends BeatRepositoryFactory {

  override def createMongoRepository(connectionString: String, databaseName: String): BeatRepository = {
    new BeatRepository {
      override def getAllBeats: Future[Seq[Beat]] = Future.successful(
        Seq(Beat("0", "Gabber", 180, "Techno", Seq(Track("Kick", "kick.mp3", "X___X___X___X___"), Track("Snare", "snare.mp3", "___X_______X___"))),
          Beat("1", "Roll", 118, "Metal", Seq())))
    }
  }
}
