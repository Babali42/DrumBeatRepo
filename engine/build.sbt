import org.scalajs.sbtplugin.ScalaJSPlugin
import org.scalajs.sbtplugin.ScalaJSPlugin.autoImport._

enablePlugins(ScalaJSPlugin)

name := "sequencer-engine"
scalaVersion := "3.8.4"

scalaJSUseMainModuleInitializer := false

Compile / fastLinkJS / scalaJSLinkerOutputDirectory :=
  baseDirectory.value / ".." / "frontend" / "engine"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core" % "0.14.16",
  "io.circe" %% "circe-generic" % "0.14.16",
  "io.circe" %% "circe-parser" % "0.14.16",

  "org.scalatest" %% "scalatest" % "3.2.20" % Test,
  "org.scalatestplus" %% "scalacheck-1-18" % "3.2.19.0" % Test,
  "org.scalacheck" %% "scalacheck" % "1.19.0" % Test
)
