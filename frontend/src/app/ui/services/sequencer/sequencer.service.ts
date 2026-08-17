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
    this.initialize();
    this.state$.subscribe(state => {
      if (!state) {
        return;
      }

      this.vm$.next({
        genre: state.genre,
        beats: this.genres.get(state.genre)?.map(x => x.label) ?? [],
        beat: state.beat,
        tracks: state.tracks.map(x => {
          const midiNote = x.midiNote !== null
            ? Option.some(x.midiNote)
            : Option.none();
          return new Track(x.name, x.filename, [...x.steps], x.isMuted, midiNote);
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

      /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
      SequencerEngine.dispatch(enriched);
      this.state$.next(SequencerEngine.getState());
      /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */

    }).catch(err => console.error('Dispatch error:', err));

    return this.dispatchQueue;
  }

  private async enrichSelectBeat(cmd: Command): Promise<Command> {
    if (cmd.type !== 'SELECT_BEAT') return cmd;

    const payload = cmd.payload as Record<string, unknown>;
    const genre = payload['genre'] as string;
    const beatLabel = payload['beat'] as string;
    const tempo = (payload['tempo'] as number) ?? undefined;

    const beatMeta = this.genres.get(genre)?.find(b => b.label === beatLabel);

    if (!beatMeta) {
      return cmd; // unknown beat
    }

    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
    const normalizeTracks = (rawTracks: any[] | undefined) => {
      if (!Array.isArray(rawTracks)) return [];
      return rawTracks.map((t: any) => {
        const stepsArr = Array.isArray(t.steps)
          ? [...t.steps]
          : Array.isArray(t.steps?.steps)
            ? [...t.steps.steps]
            : [];

        const midiNoteVal: number | null = (() => {
          try {
            const midiNote = t.midiNote;

            if (midiNote == null) {
              return null;
            }

            return typeof midiNote === 'object' && 'value' in midiNote
              ? midiNote.value
              : midiNote;
          } catch {
            return null;
          }
        })();

        return {
          name: t.name,
          filename: t.filename,
          steps: stepsArr,
          midiNote: midiNoteVal,
          isMuted: !!t.isMuted
        };
      });
    };

    try {
      const loader = (this.beatsManager as any).getBeatByFileName;
      let beatData: any = null;

      if (typeof loader === 'function') {
        const result = loader.call(this.beatsManager, beatMeta.filename);
        beatData = typeof result?.then === 'function'
          ? await result
          : await Effect.runPromise(result);
      }

      // If beatData was successfully fetched and has tracks, use them. Otherwise fallback to payload or beatMeta tracks.
      const rawPayloadTracks = payload['tracks'] as any[];
      const finalTracksSource = Array.isArray(beatData?.tracks)
        ? beatData.tracks
        : (Array.isArray(rawPayloadTracks) && rawPayloadTracks.length > 0 ? rawPayloadTracks : (beatMeta as any).tracks ?? []);

      return {
        ...cmd,
        payload: {
          genre,
          beat: beatLabel,
          tempo: tempo ?? (beatData?.tempo ?? beatMeta.bpm ?? 120),
          tracks: normalizeTracks(finalTracksSource)
        }
      };
    } catch (err) {
      console.error('Error loading beat data for', beatMeta.filename, err);
      const fallbackTracks = (payload['tracks'] as any[]) ?? (beatMeta as any).tracks ?? [];
      return {
        ...cmd,
        payload: {
          genre,
          beat: beatLabel,
          tempo: tempo ?? (beatMeta.bpm ?? 120),
          tracks: normalizeTracks(fallbackTracks)
        }
      };
    }
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
  }

  async getTracks(): Promise<readonly Track[]> {
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
      const loader = (this.beatsManager as any)?.getAllDrumsTracks;
      if (typeof loader !== 'function') {
        console.warn('beatsManager.getAllDrumsTracks not available');
        return [];
      }

      const result = loader.call(this.beatsManager);
      const tracks = typeof result?.then === 'function'
        ? await result
        : await Effect.runPromise(result);

      return tracks;
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
    } catch (err) {
      console.error('Error getting tracks', err);
      return [];
    }
  }
}