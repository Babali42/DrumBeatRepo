package secondary.repositoryFactory
import domain.{Beat, BeatRepository}

import scala.concurrent.Future

class InMemoryBeatRepositoryFactory extends BeatRepositoryFactory {

  override def createMongoRepository(connectionString: String, databaseName: String): BeatRepository = {
    new BeatRepository {
      override def getAllBeats: Future[Seq[Beat]] = Future.successful(Seq(Beat("0", "Techno", 128, "Techno"), Beat("0", "Metal", 128, "Metal")))
    }
  }
}
