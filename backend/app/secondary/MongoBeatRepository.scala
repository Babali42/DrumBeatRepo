package secondary

import domain.{Beat, BeatRepository, Track}
import org.bson.BsonValue
import org.mongodb.scala.ObservableFuture
import org.mongodb.scala.bson.collection.immutable.Document
import org.mongodb.scala.{MongoCollection, MongoDatabase}

import scala.collection.JavaConverters.*
import scala.concurrent.{ExecutionContext, Future}

class MongoBeatRepository(database: MongoDatabase, collectionName: String = "beats") extends BeatRepository {
  private lazy val collection: MongoCollection[Document] = database.getCollection(collectionName)

  private def documentToUser(doc: Document): Beat = {
    Beat(doc.getOrElse("id", "").asString().getValue,
      doc.getOrElse("label", "").asString().getValue,
      doc.getOrElse("bpm", 0).asInt32().getValue,
      doc.getOrElse("genre", "").asString().getValue,
      doc.get("tracks")
        .map(_.asArray().getValues.asScala.toSeq.map(bsonValueToTrack))
        .getOrElse(Seq.empty))
  }

  def bsonValueToTrack(bson: BsonValue): Track = {
    val doc = bson.asDocument()
    Track(
      doc.getString("name").getValue,
      doc.getString("fileName").getValue,
      doc.getString("steps").getValue
    )
  }

  override def getAllBeats: Future[Seq[Beat]] = {
    collection.find().toFuture().map(documents => documents.map(documentToUser))(ExecutionContext.global)
  }
}
