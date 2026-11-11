
import com.drumbeatrepo.sequencer.MidiDrumType
import com.drumbeatrepo.sequencer.{AudioFilename, Beat, MidiDrumType}

//TODO : appel pour lire tout les beat à la fois et obtenir tout les samples
//TODO bis : Il faudrat surement passer par les metadata et récuperer le nom de tout les beats dans un premier temps

val beat = Beat("Techno", "Techno", 128, 4, 4, 4, List())

case class Sample(name: String, filename: AudioFilename, midiDrumType: MidiDrumType);

val kick = Sample("kick", AudioFilename("kick.mp3"), MidiDrumType.BASS_DRUM_1)
val snare = Sample("snare", AudioFilename("snare.mp3"), MidiDrumType.ACOUSTIC_SNARE)

//Create the midiDrumType and category map
enum DrumCategory:
  case Kick, Snare

val midiDrumTypeToDrumCategoryMap = Map((MidiDrumType.BASS_DRUM_1, DrumCategory.Kick),
                                        (MidiDrumType.ACOUSTIC_SNARE, DrumCategory.Snare))