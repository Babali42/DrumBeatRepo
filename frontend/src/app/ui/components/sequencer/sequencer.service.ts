import { Inject, Injectable } from "@angular/core";
import { Command } from "./sequencer.command";
import { BPM } from "src/app/domain/bpm";
import IManageBeats from "src/app/domain/ports/i-manage-beats";
import { IManageBeatsToken } from "src/app/infrastructure/injection-tokens/i-manage-beat.token";
import { BehaviorSubject } from "rxjs";
import { SequencerState } from "src/types/engine";
import { SequencerViewModel } from "./sequencer.viewmodel";
import { Beat } from "src/app/domain/beat";
import { Option } from "effect";
import { Track } from "src/app/domain/track";
import { MidiDrumType } from "src/app/domain/midi-drum-type";

@Injectable({ providedIn: 'root' })
export class SequencerService {
  readonly state$ = new BehaviorSubject<SequencerState | null>(null);

  readonly vm$ = new BehaviorSubject<SequencerViewModel>(
    {} as SequencerViewModel
  );

  genres = new Map<string, Beat[]>();
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
        beat: state.beat,
        tracks: state.tracks.map(x => new Track(x.name, x.fileName, x.steps, Option.some(MidiDrumType.ACOUSTIC_BASS_DRUM))),
        tempo: BPM(state.tempo),
        historyLength: state.historyLength,
        futureLength: state.futureLength,
      });
    });
  }

  async initialize(): Promise<void> {
    const beats = await this.beatsManager.getAllBeats();

    this.genres.clear();

    for (const beat of beats) {
      const list = this.genres.get(beat.genre);

      if (list) {
        list.push(beat);
      } else {
        this.genres.set(beat.genre, [beat]);
      }
    }

    this.genresLabel = [...this.genres.keys()];
  }

  dispatch(cmd: Command): void {
    const enriched = this.enrichSelectBeat(cmd);
    SequencerEngine.dispatch(enriched);
    this.state$.next(SequencerEngine.getState());
  }

  private enrichSelectBeat(cmd: Command): Command {
    if (cmd.type !== 'SELECT_BEAT') return cmd;

    const payload = cmd.payload as Record<string, unknown>;
    if (payload['tracks']) return cmd;

    const genre = payload['genre'] as string;
    const beat = payload['beat'] as string;
    const beatData = this.genres.get(genre)?.find(b => b.label === beat);
    if (!beatData) return cmd;

    return {
      ...cmd,
      payload: {
        ...payload,
        tracks: beatData.tracks.map(t => ({
          name: t.name,
          fileName: t.fileName,
          steps: [...t.steps.steps],
          midiNote: Option.isSome(t.midiNote) ? (t.midiNote.value as number) : null,
        })),
      },
    };
  }
}
