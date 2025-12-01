import {BeatAdapter} from "./beat-adapter.service";
import {Beat} from "../../../../core/domain/beat";
import {JsonFilesReaderInterface} from "./json-files-reader.interface";
import {Observable, of} from "rxjs";
import {TestBed} from "@angular/core/testing";
import {CompactBeat} from "./compact-beat";
import {jsonFileReaderToken} from "../../../injection-tokens/json-file-reader.token";

describe("Beat adapter service", () => {

  const mock: JsonFilesReaderInterface = {
    loadAllJson(): Observable<CompactBeat[]> {
      return of([{
        "label": "Metal",
        "genre": "Metal",
        "bpm": 180,
        "tracks": [
          {
            "name": "Snare",
            "fileName": "metal/snare.mp3",
            "steps": "____X_______X___"
          },
          {
            "name": "Hats",
            "fileName": "metal/crash.mp3",
            "steps": "X___X___X___X___"
          },
          {
            "name": "Kick",
            "fileName": "metal/kick.mp3",
            "steps": "XXXXXXXXXXXXXXXX"
          }
        ]
      }]);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: jsonFileReaderToken, useValue: mock },
        BeatAdapter,
      ]
    }).compileComponents();
  });

  it("should return compact beats",() => {
    //Arrange
    const systemUnderTest = TestBed.inject(BeatAdapter);

    //Act
    systemUnderTest.getAllBeats().then((beats: readonly Beat[]) => {
      //Assert
      expect(beats.length).toBeGreaterThan(0);
    })
  })
})
