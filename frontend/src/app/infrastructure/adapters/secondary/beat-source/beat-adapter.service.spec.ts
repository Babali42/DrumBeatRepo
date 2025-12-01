import {BeatAdapter} from "./beat-adapter.service";
import {Beat} from "../../../../core/domain/beat";
import {JSON_TOKEN, JsonFileReaderInterface} from "./jsonFileReaderInterface";
import {Observable, of} from "rxjs";
import {TestBed} from "@angular/core/testing";

describe("Beat adapter service", () => {

  let mock: JsonFileReaderInterface = {
    loadAllJson(): Observable<any[]> {
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
        { provide: JSON_TOKEN, useValue: mock },
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
