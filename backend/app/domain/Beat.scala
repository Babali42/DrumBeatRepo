package domain

case class Beat(id: String, label: String, bpm: Int, genre: String, tracks: Seq[Track])