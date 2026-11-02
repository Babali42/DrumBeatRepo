import { Injectable } from "@angular/core";
import { Command } from "./sequencer.command";
import { BPM } from "src/app/domain/bpm";
import { BehaviorSubject } from "rxjs";
import { BeatMetadata, SequencerState } from "src/types/engine";
import { SequencerViewModel } from "../../components/sequencer/sequencer.viewmodel";
import { Option } from "effect";
import { Track } from "src/app/domain/track";

@Injectable({ providedIn: 'root' })
export class SequencerService {
  readonly state$ = new BehaviorSubject<SequencerState | null>(null);
  readonly vm$ = new BehaviorSubject<SequencerViewModel>({} as SequencerViewModel);

  // eslint-disable-next-line functional/prefer-readonly-type
  genres = new Map<string, BeatMetadata[]>();
  genresLabel: readonly string[] = [];

  constructor() {
    this.state$.subscribe(state => {
      if (!state) {
        return;
      }

      this.vm$.next({
        genre: state.genre,
        beats: this.genres.get(state.genre)?.map(x => x.label) ?? [],
        beat: state.beat,
        tracks: state.tracks.map(x => new Track(x.name, x.filename, [...x.steps], x.isMuted, x.isSolo, Option.fromNullOr(x.midiNote))),
        tempo: BPM(state.tempo),
        beatsPerBar: state.beatsPerBar,
        subdivisionsPerBeat: state.subdivisionsPerBeat,
        numberOfBar: state.numberOfBar,
        historyLength: state.historyLength,
        futureLength: state.futureLength
      });
    });
  }

  async initialize(): Promise<void> {
    try {
      this.genres.clear();

      const beatManifests = await BeatLibrary.loadBeatsManifest();

      for (const beatMeta of beatManifests) {
        const beats = this.genres.get(beatMeta.genre) ?? [];
        beats.push(beatMeta);
        this.genres.set(beatMeta.genre, beats);
      }

      this.genresLabel = [...this.genres.keys()];
    } catch (error) {
      console.error("Failed to load beat manifest : ", error);
      throw error;
    }
  }

  private dispatchQueue: Promise<void> = Promise.resolve();

  dispatch(cmd: Command): Promise<void> {
    this.dispatchQueue = this.dispatchQueue.then(async () => {
      await SequencerEngine.dispatch(cmd);

      const state = SequencerEngine.getState();

      console.log('Selected beat:', state.beat);
      console.log('Selected genre:', state.genre);
      console.log('Tracks:', state.tracks);

      this.state$.next(SequencerEngine.getState());
    }).catch(err => console.error('Dispatch error:', err));

    return this.dispatchQueue;
  }
}
