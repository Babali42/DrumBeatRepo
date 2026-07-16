enablePlugins(ScalaJSPlugin)

name := "sequencer-engine"
scalaVersion := "3.8.4"

scalaJSUseMainModuleInitializer := false

Compile / fastLinkJS / scalaJSLinkerOutputDirectory := baseDirectory.value /
  ".." / "frontend" / "engine"

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest" % "3.2.20" % Test,
  "org.scalatestplus" %% "scalacheck-1-18" % "3.2.19.0" % Test,
  "org.scalacheck" %% "scalacheck" % "1.19.0" % Test
)
