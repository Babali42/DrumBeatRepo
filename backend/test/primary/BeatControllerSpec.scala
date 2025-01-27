package primary

import org.scalatestplus.play._
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test._
import play.api.test.Helpers._
import secondary.repositoryFactory.{BeatRepositoryFactory, InMemoryBeatRepositoryFactory}

class BeatControllerSpec extends PlaySpec {
  "BeatController" should {
    "get the JSON beats" in {
      val app = new GuiceApplicationBuilder()
        .overrides(bind(classOf[BeatRepositoryFactory]).to(classOf[InMemoryBeatRepositoryFactory]))
        .build()

      val request = FakeRequest(GET, "/beats/")
      val result = route(app, request).get

      status(result) mustBe OK
      contentType(result) mustBe Some("application/json")
      contentAsString(result) must include("Techno")
    }
  }
}
