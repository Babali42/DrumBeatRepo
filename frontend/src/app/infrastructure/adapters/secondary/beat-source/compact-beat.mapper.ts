import {Beat} from "../../../../core/domain/beat";
import {CompactBeat} from "./compact-beat";
import {Track} from "../../../../core/domain/track";
import {BPM} from "../../../../core/domain/bpm";

export class CompactBeatMapper {
  static toBeat(compact: CompactBeat): Beat {
    return {
      label: compact.label,
      genre: compact.genre,
      bpm: BPM(compact.bpm),
      tracks: compact.tracks.map(track => new Track(track.name, track.fileName, [...track.steps].map(char => char === 'X')))
    };
  }

  static toCompactBeat(beat: Beat): CompactBeat {
    return {
      label: beat.label,
      genre: beat.genre,
      bpm: beat.bpm,
      tracks: beat.tracks.map(track => ({
        name: track.name,
        fileName: track.fileName,
        steps: track.steps.steps.map(x => x? "X":" ").join('')
      }))
    }
  }
}
