package domain

case class Beat(id: String, label: String, bpm: Int, genre: String, tracks: Seq[Track]) {
  def as[T](implicit f: Beat => T): T = f(this)
}

object Beat {
  implicit def beatMapper: Beat => primary.Beat = (beat: Beat) => primary.Beat(beat.id, beat.label, beat.bpm, beat.genre, beat.tracks.map(x => x.as[primary.Track]))
}