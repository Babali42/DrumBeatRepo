import { Inject, Injectable } from "@angular/core";
import { Command } from "./sequencer.command";
import { BPM } from "src/app/domain/bpm";
import IManageBeats from "src/app/domain/ports/i-manage-beats";
import { IManageBeatsToken } from "src/app/infrastructure/injection-tokens/i-manage-beat.token";
import { BehaviorSubject } from "rxjs";
import { SequencerState } from "src/types/engine";
import { SequencerViewModel } from "./sequencer.viewmodel";
import { Beat } from "src/app/domain/beat";

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
    SequencerEngine.dispatch(cmd);
    this.state$.next(SequencerEngine.getState());
  }
}