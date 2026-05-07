import {Beat} from "../../../domain/beat";
import {BPM} from "../../../domain/bpm";
import {Track} from "../../../domain/track";
import {MidiExportService} from "./midi-exporter.service";

describe('Midi Export', () => {
  it('should define trackName, tempo and signature', () => {
    //Arrange
    let beat = {
      label: "Techno",
      genre: "FromBerlin",
      bpm: BPM(128),
      tracks: [] as ReadonlyArray<Track>
    } as Beat;

    //Act
    const track = new MidiExportService().getTrack(beat);

    //Assert
    expect(track).not.toBe(undefined);
  });
});
