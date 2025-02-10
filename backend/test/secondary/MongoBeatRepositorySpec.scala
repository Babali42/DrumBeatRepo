package secondary

import org.mongodb.scala.bson.collection.immutable.Document
import org.mongodb.scala.{MongoClient, MongoDatabase}
import org.scalatest.BeforeAndAfterEach
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import org.mongodb.scala.ObservableFuture

import scala.concurrent.Await
import scala.concurrent.duration.DurationInt

class MongoBeatRepositorySpec extends AsyncFlatSpec with Matchers with BeforeAndAfterEach  {
  val mongoClient = MongoClient("mongodb://admin:pass@localhost:27017")
  val testDatabase: MongoDatabase = mongoClient.getDatabase("drum-beat-database")
  val tableName = "beats-for-in-memory-test"

  override def beforeEach(): Unit = {
    super.beforeEach()
    val collection = testDatabase.getCollection(tableName)
    Await.result(collection.drop().toFuture(), 2.seconds)
    val testDocuments = Seq(
      Document("id" -> "1", "label" -> "Techno", "bpm" -> 128),
      Document("id" -> "2", "label" -> "Metal", "bpm" -> 180)
    )
    Await.result(collection.insertMany(testDocuments).toFuture(), 2.seconds)
  }

  "Mongo beat repository" should "return all beats" in {
    val repository = new MongoBeatRepository(testDatabase, tableName)
    repository.getAllBeats.map { users =>
      users.size shouldBe 2
      users.head.label shouldBe "Techno"
    }
  }
}