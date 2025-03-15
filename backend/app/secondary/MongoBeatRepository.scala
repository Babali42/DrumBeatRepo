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

  override def getAllBeats: Future[Option[Seq[Beat]]] = {
    collection.find().toFuture().map(documents => documents.map(documentToUser).foldLeft(Some(Seq()))(addOrResign))(ExecutionContext.global)
  }

  private def documentToUser(doc: Document): Option[Beat] = {
    for {
      id     <- doc.get("id").map(_.asString().getValue)
      label  <- doc.get("label").map(_.asString().getValue)
      bpm    <- doc.get("bpm").map(_.asInt32().getValue)
      genre  <- doc.get("genre").map(_.asString().getValue)
    } yield Beat(
      id,
      label,
      bpm,
      genre,
      doc.get("tracks")
        .map(_.asArray().getValues.asScala.toSeq.flatMap(bsonValueToTrack))
        .getOrElse(Seq.empty)
    )
  }

  private def bsonValueToTrack(bson: BsonValue): Option[Track] = {
    val doc = bson.asDocument()

    for {
      name     <- Option(doc.get("name")).map(_.asString().getValue)
      fileName <- Option(doc.get("fileName")).map(_.asString().getValue)
      steps    <- Option(doc.get("steps")).map(_.asString().getValue)
    } yield Track(name, fileName, steps.toCharArray().map(x => x == 'X'))
  }

  private def addOrResign(parsedBeats : Option[Seq[Beat]], newParsedBeat: Option[Beat]) = {
    for {
      beats   <- parsedBeats
      parsedBeat   <- newParsedBeat
    } yield beats.appended(parsedBeat)
  }
}
