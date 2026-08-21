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
import { BEATS_MANIFEST } from '../../../../assets/beats/beats-manifest';
import {BeatMetadata} from "../../../domain/beat-metadata";

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
      const beats = this.genres.get(beatMeta.genre) ?? [];
      beats.push(beatMeta);
      this.genres.set(beatMeta.genre, beats);
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

    const beatMeta = this.genres.get(genre)?.find(b => b.label === beatLabel);

    if (!beatMeta) {
      return cmd; // unknown beat
    }

    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
    const normalizeTracks = (rawTracks: any[] | undefined) =>
      rawTracks?.map((t: any) => {
        const steps = Array.isArray(t.steps)
          ? [...t.steps]
          : Array.isArray(t.steps?.steps)
            ? [...t.steps.steps]
            : [];

        const midiNote =
          typeof t.midiNote === 'number'
            ? t.midiNote
            : typeof t.midiNote?.value === 'number'
              ? t.midiNote.value
              : null;

        return {
          name: t.name,
          filename: t.filename,
          steps,
          midiNote,
          isMuted: !!t.isMuted
        };
      }) ?? [];

    try {
      const beatData = await Effect.runPromise(
        this.beatsManager.getBeatByFileName(beatMeta.filename)
      );

      const rawPayloadTracks = payload["tracks"] as any[];
      const tracks = beatData.tracks.length > 0
        ? beatData.tracks
        : rawPayloadTracks?.length
          ? rawPayloadTracks
          : (beatMeta as any).tracks ?? [];

      return {
        ...cmd,
        payload: {
          genre,
          beat: beatLabel,
          tempo: beatData.bpm,
          tracks: normalizeTracks(tracks)
        }
      };
    } catch (err) {
      console.error(
        "Error loading beat data for",
        beatMeta.filename,
        err
      );

      return {
        ...cmd,
        payload: {
          genre,
          beat: beatLabel,
          tempo: 120,
          tracks: normalizeTracks(
            (payload["tracks"] as any[]) ??
            (beatMeta as any).tracks ??
            []
          )
        }
      };
    }
  }
}
