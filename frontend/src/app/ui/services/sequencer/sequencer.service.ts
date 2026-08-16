import { Inject, Injectable } from "@angular/core";
import { Command } from "./sequencer.command";
import { BPM } from "src/app/domain/bpm";
import IManageBeats from "src/app/domain/ports/i-manage-beats";
import { IManageBeatsToken } from "src/app/infrastructure/injection-tokens/i-manage-beat.token";
import { BehaviorSubject } from "rxjs";
import { SequencerState } from "src/types/engine";
import { SequencerViewModel } from "../../components/sequencer/sequencer.viewmodel";
import { Effect, Option } from "effect";
import { Track } from "src/app/domain/track";
import { BEATS_MANIFEST, BeatMetadata } from './beats-manifest';

@Injectable({ providedIn: 'root' })
export class SequencerService {
  readonly state$ = new BehaviorSubject<SequencerState | null>(null);

  readonly vm$ = new BehaviorSubject<SequencerViewModel>(
    {} as SequencerViewModel
  );

  // eslint-disable-next-line functional/prefer-readonly-type
  genres = new Map<string, BeatMetadata[]>();
  genresLabel: readonly string[] = [];

  constructor(
    @Inject(IManageBeatsToken)
    private readonly beatsManager: IManageBeats
  ) {
    this.state$.subscribe(state => {
      if (!state) {
        return;
      }

      const validLengths = [8, 16, 32, 64];
      this.vm$.next({
        genre: state.genre,
        beats: this.genres.get(state.genre)?.map(x => x.label) ?? [],
        beat: state.beat,
        tracks: state.tracks.map(x => {
          const steps = validLengths.includes(x.steps.length)
            ? [...x.steps]
            : [...x.steps, ...Array<boolean>(16 - x.steps.length).fill(false)];
          const midiNote = x.midiNote !== null
            ? Option.some(x.midiNote)
            : Option.none();
          return new Track(x.name, x.filename, steps, x.isMuted, midiNote);
        }),
        tempo: BPM(state.tempo),
        historyLength: state.historyLength,
        futureLength: state.futureLength
      });
    });
  }

  initialize(): void {
    this.genres.clear();

    for (const beatMeta of BEATS_MANIFEST) {
      const list = this.genres.get(beatMeta.genre);

      if (list) {
        list.push(beatMeta);
      } else {
        this.genres.set(beatMeta.genre, [beatMeta]);
      }
    }

    this.genresLabel = [...this.genres.keys()];
  }

  private dispatchQueue: Promise<void> = Promise.resolve();

  dispatch(cmd: Command): Promise<void> {
    this.dispatchQueue = this.dispatchQueue.then(async () => {
      const enriched = await this.enrichSelectBeat(cmd);
      
      SequencerEngine.dispatch(enriched);
      this.state$.next(SequencerEngine.getState());
      
    }).catch(err => console.error('Dispatch error:', err));
    
    return this.dispatchQueue;
  }

  private async enrichSelectBeat(cmd: Command): Promise<Command> {
    if (cmd.type !== 'SELECT_BEAT') return cmd;

    const payload = cmd.payload as Record<string, unknown>;
    const genre = payload['genre'] as string;
    const beatLabel = payload['beat'] as string;
    const tempo = payload['tempo'] as number;
    
    // 1. Find the metadata (which now just has label and filename)
    const beatMeta = this.genres.get(genre)?.find(b => b.label === beatLabel);

    if (beatMeta) {
      // 2. LAZY LOAD: Fetch the heavy data ONLY when a beat is selected!
      const beatData = await Effect.runPromise(
        this.beatsManager.getBeatByFileName(beatMeta.filename)
      );

      return {
        ...cmd,
        payload: {
          genre,
          beat: beatLabel,
          tempo,
          tracks: beatData.tracks.map(t => ({
            name: t.name,
            filename: t.filename,
            steps: [...t.steps.steps],
            midiNote: Option.isSome(t.midiNote) ? t.midiNote.value : null,
            isMuted: t.isMuted
          })),
        },
      };
    }

    return cmd;
  }

  async getTracks(): Promise<readonly Track[]> {
    return Effect.runPromise(this.beatsManager.getAllDrumsTracks())
  }
}