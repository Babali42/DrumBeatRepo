package primary

import primary.{Beat, Track}
import org.scalatestplus.play.*
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.{JsSuccess, Json}
import play.api.test.*
import play.api.test.Helpers.*
import secondary.repositoryFactory.{BeatRepositoryFactory, InMemoryBeatRepositoryFactory}

class BeatControllerSpec extends PlaySpec {
  "BeatController" should {
    "get the JSON beats" in {
      //Arrange
      val routeInvoker = route(new GuiceApplicationBuilder()
        .overrides(bind(classOf[BeatRepositoryFactory]).to(classOf[InMemoryBeatRepositoryFactory]))
        .build(), FakeRequest(GET, "/beats/"))
      
       //Act
      val result = routeInvoker.get

      //Assert
      status(result) mustBe OK
      contentType(result) mustBe Some("application/json")
      Json.parse(contentAsString(result)).validate[Seq[Beat]] mustBe JsSuccess(
        Seq(
          Beat("0", "Gabber", 180, "Techno", Seq(Track("Kick", "kick.mp3", "X___X___X___X___"), Track("Snare", "snare.mp3", "___X_______X___"))),
          Beat("1", "Roll", 118, "Metal", Seq())))
    }
  }
}
