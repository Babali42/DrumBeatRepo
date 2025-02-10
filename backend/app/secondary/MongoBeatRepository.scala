package secondary

import domain.{Beat, BeatRepository}
import org.mongodb.scala.ObservableFuture
import org.mongodb.scala.bson.collection.immutable.Document
import org.mongodb.scala.{MongoCollection, MongoDatabase}

import scala.concurrent.{ExecutionContext, Future}

class MongoBeatRepository(database: MongoDatabase, collectionName: String = "beats") extends BeatRepository {
  private lazy val collection: MongoCollection[Document] = database.getCollection(collectionName)

  private def documentToUser(doc: Document): Beat = {
    Beat(doc.getOrElse("id", "").asString().getValue, doc.getOrElse("label", "").asString().getValue, doc.getOrElse("bpm", 0).asInt32().getValue, "")
  }

  override def getAllBeats: Future[Seq[Beat]] = {
    collection.find().toFuture().map(documents => documents.map(documentToUser))(ExecutionContext.global)
  }
}
