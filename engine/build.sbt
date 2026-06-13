enablePlugins(ScalaJSPlugin)

name := "sequencer-engine"
scalaVersion := "3.8.4"

scalaJSUseMainModuleInitializer := false

Compile / fastLinkJS / scalaJSLinkerOutputDirectory := baseDirectory.value /
  ".." / "frontend" / "engine"
