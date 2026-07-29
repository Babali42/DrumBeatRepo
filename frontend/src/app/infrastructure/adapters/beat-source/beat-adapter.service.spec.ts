import { BeatAdapter } from "./beat-adapter.service";
import { JsonFilesReaderInterface } from "./json-files-reader.interface";
import { TestBed } from "@angular/core/testing";
import { CompactBeat } from "./compact-beat";
import { jsonFileReaderToken } from "../../injection-tokens/json-file-reader.token";
import { toMp3FilePath } from "../../../domain/filenames/mp3.filepath";
import { Effect, Option } from "effect";

describe("Beat adapter service", () => {

  const mock: JsonFilesReaderInterface = {
    loadAllJson(): Effect.Effect<Option.Option<CompactBeat>[]> {
      return Effect.succeed([Option.some({
        "label": "Metal",
        "genre": "Metal",
        "bpm": 180,
        "tracks": [
          {
            "name": "Snare",
            "midiNote": 38,
            "fileName": toMp3FilePath("metal/snare.mp3"),
            "steps": "____X_______X___"
          },
          {
            "name": "Hats",
            "midiNote": 38,
            "fileName": toMp3FilePath("metal/carsh.mp3"),
            "steps": "X___X___X___X___"
          },
          {
            "name": "Kick",
            "midiNote": 38,
            "fileName": toMp3FilePath("metal/kick.mp3"),
            "steps": "XXXXXXXXXXXXXXXX"
          },
          {
            "name": "Bass",
            "midiNote": undefined,
            "fileName": toMp3FilePath("metal/bass.mp3"),
            "steps": "XXXXXXXXXXXXXXXX"
          }
        ]
      }),
      Option.some(
        {
          "label": "MetalWithDoubleKick",
          "genre": "Metal",
          "bpm": 180,
          "tracks": [
            {
              "name": "Snare2",
              "midiNote": 38,
              "fileName": "metal/snare2.mp3",
              "steps": "____X_______X___"
            },
            {
              "name": "Kick",
              "midiNote": 38,
              "fileName": "metal/kick.mp3",
              "steps": "XXXXXXXXXXXXXXXX"
            },
            {
              "name": "Synth",
              "midiNote": undefined,
              "fileName": toMp3FilePath("metal/bass2.mp3"),
              "steps": "XXXXXXXXXXXXXXXX"
            }
          ]
        }
      )
      ]);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: jsonFileReaderToken, useValue: mock }
      ]
    }).compileComponents();
  });

  it("should return beats", async () => {
    //Arrange
    const systemUnderTest = TestBed.inject(BeatAdapter);

    //Act
    const beats = await Effect.runPromise(systemUnderTest.getAllBeats());

    //Assert
    expect(beats.length).toBeGreaterThan(0);
  })

  it("should return all drums tracks distinct by filename", async () => {
    //Arrange
    const systemUnderTest = TestBed.inject(BeatAdapter);

    //Act
    const tracks = await Effect.runPromise(systemUnderTest.getAllDrumsTracks());

    //Assert
    expect(tracks.map(x => x.name)).toEqual(['Snare', 'Hats', 'Kick', 'Snare2']);
  })
})
