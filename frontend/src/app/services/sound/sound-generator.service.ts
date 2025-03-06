import {Injectable} from "@angular/core";
import {Track} from "../../domain/track";
import {Sample} from "./sample";

@Injectable({providedIn: "root"})
export class SoundGeneratorService {
  //Rendered sound (twice the grid length)  ████░░░░
  //Played sound (the doted part is looped) ████░░░░░░░░░░░░░░░░░░░░░░░░
  //Used to avoid sound clip ;)
  async getRenderedBuffer(tracks: Track[], samples: Sample[], bpm: number, stepNumber: number): Promise<AudioBuffer> {
    const tickLength = this.getTickLength(bpm);
    const offlineContext: OfflineAudioContext = new OfflineAudioContext(1, stepNumber * 2 * tickLength * 44100, 44100);
    tracks.forEach((track: Track) => {
      const trackSteps = this.getDuplicatedTrackSteps(track);
      trackSteps.forEach((beat: boolean, i: number) => {
        if (!beat)
          return;

        const audioBuffer = samples.find(x => x.fileName === track.fileName)!.sample!;
        const audioBufferSourceNode = offlineContext.createBufferSource();
        audioBufferSourceNode.buffer = audioBuffer;
        audioBufferSourceNode.connect(offlineContext.destination);

        const when = i * tickLength;
        audioBufferSourceNode.start(when);
      });
    });

    offlineContext.oncomplete = (event: OfflineAudioCompletionEvent) => {
      return event.renderedBuffer;
    }
    return await offlineContext.startRendering();
  }

  private getDuplicatedTrackSteps(track: Track): boolean[] {
    const duplicatedTracks = [...track.steps]
    duplicatedTracks.push(...track.steps);
    return duplicatedTracks;
  }

  private getTickLength(bpm: number): number {
    return 60 / bpm / 4;
  };
}
