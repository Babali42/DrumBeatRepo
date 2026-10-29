enablePlugins(ScalaJSPlugin)

name := "sequencer-engine"
scalaVersion := "3.10.0"

scalaJSUseMainModuleInitializer := false

// support both fastLinkJS and fullLinkJS commands
// used in dev/test mode
Compile / fastLinkJS / scalaJSLinkerOutputDirectory :=
  baseDirectory.value / ".." / "frontend" / "engine"

// used in production mode
Compile / fullLinkJS / scalaJSLinkerOutputDirectory := baseDirectory.value /
  ".." / "frontend" / "engine"

libraryDependencies ++= Seq(
  // dom
  "org.scala-js" %% "scalajs-dom" % "2.8.1",

  // cats effect
  "org.typelevel" %% "cats-effect" % "3.7.1", // in sbt2 %%% aren't yet necessary

  // circe
  "io.circe" %% "circe-core" % "0.14.17",
  "io.circe" %% "circe-generic" % "0.14.17",
  "io.circe" %% "circe-parser" % "0.14.17",

  // test dependencies
  "org.scalatest" %% "scalatest" % "3.2.20" % Test,
  "org.scalatestplus" %% "scalacheck-1-18" % "3.2.19.0" % Test,
  "org.scalacheck" %% "scalacheck" % "1.20.0" % Test,
  "org.typelevel" %% "cats-effect-testing-scalatest" % "1.5.0" % Test
)

scalacOptions ++= Seq(
  "-deprecation",
  "-feature",
  "-unchecked",
  "-Wunused:all",
  "-Wvalue-discard",
  "-explain"
)
