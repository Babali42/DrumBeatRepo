enablePlugins(ScalaJSPlugin)

name := "sequencer-engine"
scalaVersion := "3.8.4"

scalaJSUseMainModuleInitializer := false

Compile / fastLinkJS / scalaJSLinkerOutputDirectory := baseDirectory.value /
  ".." / "frontend" / "engine"

libraryDependencies ++= Seq(
  "org.scalatest" %%% "scalatest" % "3.2.19" % Test
)