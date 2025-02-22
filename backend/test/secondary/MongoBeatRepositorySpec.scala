package secondary

import org.mongodb.scala.bson.collection.immutable.Document
import org.mongodb.scala.{MongoClient, MongoDatabase, ObservableFuture, bson}
import org.scalatest.BeforeAndAfterEach
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import org.mongodb.scala.bson.BsonArray

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
      Document("id" -> "1", "label" -> "Detroit", "bpm" -> 128, "genre" -> "Techno", "tracks" ->
        BsonArray(bson.Document("name" -> "Kick", "fileName" -> "kick.mp3", "steps" -> "X___X___X___X___"),
                  bson.Document("name" -> "Snare", "fileName" -> "snare.mp3", "steps" -> "__X___X___X___X_"))
      ),
      Document("id" -> "2", "label" -> "Djent", "bpm" -> 180, "genre" -> "Metal", "tracks" -> BsonArray())
    )
    Await.result(collection.insertMany(testDocuments).toFuture(), 2.seconds)
  }

  "Mongo beat repository" should "return all beats" in {
    val repository = new MongoBeatRepository(testDatabase, tableName)
    repository.getAllBeats.map { beats =>
      //Beat collection asserts
      beats.size shouldBe 2

      //Beat fields asserts
      val firstBeat = beats.head
      firstBeat.label shouldBe "Detroit"
      firstBeat.bpm shouldBe 128
      firstBeat.genre shouldBe "Techno"

      firstBeat.tracks.size shouldBe 2
      val firstTrack = firstBeat.tracks.head
      //Track fields asserts
      firstTrack.name shouldBe "Kick"
      firstTrack.fileName shouldBe "kick.mp3"
      firstTrack.steps shouldBe "X___X___X___X___"
    }
  }
}