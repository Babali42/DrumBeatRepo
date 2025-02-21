name := """drum-beat-repo-backend"""
organization := "babali"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)
val currentEnv: String = sys.env.getOrElse("ENV", "development")

scalaVersion := "3.3.5"
coverageEnabled := sys.props.get("enable.coverage").contains("true")

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.1" % Test
libraryDependencies += ("org.mongodb.scala" %% "mongo-scala-driver" % "4.10.1").cross(CrossVersion.for3Use2_13)
