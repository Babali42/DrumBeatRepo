import {Injectable} from "@angular/core";
import {Track} from "../models/track";
import {Sound} from "./sound";
import * as Tone from 'tone';
import {Sequence} from "tone";

@Injectable({
  providedIn: 'root'
})
export class SoundTone implements Sound {
  bpm: number = 120;
  isPlaying: boolean = false;
  index: number = 0;
  private sequence: Sequence<any> = new Sequence();
  private stepNumber: number = 16;

  pause(): void {
  }

  playPause(): Promise<void> {
    this.sequence.start(0);
    Tone.Transport.start();
    return Promise.resolve(undefined);
  }

  reset(): void {
    this.sequence = new Sequence();
  }

  setBpm(bpm: number): void {
    Tone.Transport.bpm.value = bpm;
  }

  setStepNumber(length: number): void {
    this.stepNumber = length;
  }

  setTracks(tracks: Track[]): void {
    Tone.start().then(() => {
      const players = {};

      tracks.forEach(track => {
        // @ts-ignore
        players[track.name] = new Tone.Player({
          url: "assets\\sounds\\" + track.fileName,
          loop: false, // Ensure the sample plays fully without looping
        }).toDestination();
      });

      // Create a single sequence to orchestrate all tracks
      const stepsPerTrack = tracks.map(track => track.steps);
      const totalSteps = tracks[0].steps.length;

      this.sequence = new Tone.Sequence((time, stepIndex) => {
        tracks.forEach((track, trackIndex) => {
          const shouldPlay = stepsPerTrack[trackIndex][stepIndex];
          if (shouldPlay) {
            // @ts-ignore
            players[track.name].start(time);
          }
        });
      }, Array.from({length: totalSteps}, (_, i) => i), "16n");
    });
  }
}