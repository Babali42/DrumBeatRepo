import { Inject, Injectable } from "@angular/core";
import { Command } from "./sequencer.command";
import { BPM } from "src/app/domain/bpm";
import IManageBeats from "src/app/domain/ports/i-manage-beats";
import { IManageBeatsToken } from "src/app/infrastructure/injection-tokens/i-manage-beat.token";
import { BehaviorSubject } from "rxjs";
import { BeatMetadata, SequencerState } from "src/types/engine";
import { SequencerViewModel } from "../../components/sequencer/sequencer.viewmodel";
import { Effect, Option } from "effect";
import { Track } from "src/app/domain/track";

@Injectable({ providedIn: 'root' })
export class SequencerService {
  readonly state$ = new BehaviorSubject<SequencerState | null>(null);
  readonly vm$ = new BehaviorSubject<SequencerViewModel>({} as SequencerViewModel);

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

      this.vm$.next({
        genre: state.genre,
        beats: this.genres.get(state.genre)?.map(x => x.label) ?? [],
        beat: state.beat,
        tracks: state.tracks.map(x => new Track(x.name, x.filename, [...x.steps], x.isMuted, x.isSolo, Option.fromNullOr(x.midiNote))),
        tempo: BPM(state.tempo),
        beatsPerBar: state.beatsPerBar,
        subdivisionsPerBeat: state.subdivisionsPerBeat,
        numberOfBars: state.numberOfBars,
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
      const enriched = await this.enrichSelectBeat(cmd);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      await SequencerEngine.dispatch(enriched);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      this.state$.next(SequencerEngine.getState());
    }).catch(err => console.error('Dispatch error:', err));

    return this.dispatchQueue;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access*/
  normalizeTracks = (rawTracks: readonly Track[]) =>
    rawTracks?.map((t: any) => {
      return {
        name: t.name,
        filename: t.filename,
        steps: [...t.steps.steps],
        midiNote: typeof t.midiNote?.value === 'number' ? t.midiNote.value : null,
        isMuted: !!t.isMuted,
        isSolo: !!t.isSolo
      };
    }) ?? [];


  private async enrichSelectBeat(cmd: Command): Promise<Command> {
    if (cmd.type !== 'SELECT_BEAT') return cmd;

    const payload = cmd.payload as Record<string, unknown>;
    const genre = payload['genre'] as string;
    const beatLabel = payload['beat'] as string;

    const beatMeta = this.genres.get(genre)?.find(b => b.label === beatLabel);
    const beatData = await Effect.runPromise(this.beatsManager.getBeatByFileName(beatMeta!.filename));

    return {
      ...cmd,
      payload: {
        genre,
        beat: beatLabel,
        tempo: beatData.bpm,
        beatsPerBar: beatData.beatsPerBar,
        subdivisionsPerBeat: beatData.subdivisionsPerBeat,
        numberOfBars: beatData.numberOfBar,
        tracks: this.normalizeTracks(beatData.tracks)
      }
    };
  }
}
