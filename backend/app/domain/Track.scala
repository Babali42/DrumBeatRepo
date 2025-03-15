package domain

case class Track(name: String, fileName: String, steps: Seq[Boolean]) {
  def as[T](implicit f: Track => T): T = f(this)
}

object Track {
  implicit def beatMapper: Track => primary.Track = (track: Track) => primary.Track(track.name, track.fileName, track.steps)
}