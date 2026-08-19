import { BeatAdapter } from "./beat-adapter.service";
import { JsonFilesReaderInterface } from "./json-files-reader.interface";
import { TestBed } from "@angular/core/testing";
import { CompactBeat } from "./compact-beat";
import { jsonFileReaderToken } from "../../injection-tokens/json-file-reader.token";
import { toMp3FilePath } from "../../../domain/filenames/mp3.filepath";
import { Effect, Option } from "effect";

describe("Beat adapter service", () => {

  const mock: JsonFilesReaderInterface = {
    loadJsonByFileName(fileName: string): Effect.Effect<Option.Option<CompactBeat>> {
      return Effect.succeed(Option.some({
        "label": "Metal",
        "genre": "Metal",
        "bpm": 180,
        "beatsPerBar": 4,
        "subdivisionsPerBeat": 4,
        "numberOfBar": 1,
        "tracks": [
          {
            "name": "Snare",
            "midiNote": 38,
            "filename": toMp3FilePath("metal/snare.mp3"),
            "steps": "____X_______X___",
            "isMuted": false
          },
          {
            "name": "Hats",
            "midiNote": 38,
            "filename": toMp3FilePath("metal/carsh.mp3"),
            "steps": "X___X___X___X___",
            "isMuted": false
          },
          {
            "name": "Kick",
            "midiNote": 38,
            "filename": toMp3FilePath("metal/kick.mp3"),
            "steps": "XXXXXXXXXXXXXXXX",
            "isMuted": false
          },
          {
            "name": "Kick",
            "midiNote": 38,
            "filename": toMp3FilePath("metal/kick.mp3"),
            "steps": "XXXXXXXXXXXXXXXX",
            "isMuted": false
          },
          {
            "name": "Bass",
            "midiNote": undefined,
            "filename": toMp3FilePath("metal/bass.mp3"),
            "steps": "XXXXXXXXXXXXXXXX",
            "isMuted": false
          }
        ]
      }));
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: jsonFileReaderToken, useValue: mock }
      ]
    }).compileComponents();
  });

  it("should return beats manifest", async () => {
    //Arrange
    const systemUnderTest = TestBed.inject(BeatAdapter);

    //Act
    const beats = await Effect.runPromise(systemUnderTest.getBeatsManifest());

    //Assert
    expect(beats.length).toBeGreaterThan(0);
  })

  it("should return all drums tracks distinct by filename", async () => {
    //Arrange
    const systemUnderTest = TestBed.inject(BeatAdapter);

    //Act
    const tracks = await Effect.runPromise(systemUnderTest.getAllDrumsTracks());

    //Assert
    expect(tracks.map(x => x.name)).toEqual(['Snare', 'Hats', 'Kick']);
  })
})
