import {Beat} from "../../../../core/domain/beat";
import {CompactBeat} from "./compact-beat";
import {Bpm} from "../../../../core/domain/bpm";
import {Track} from "../../../../core/domain/track";

export class CompactBeatMapper {
  static toBeat(compact: CompactBeat): Beat {
    return {
      id: compact.id,
      label: compact.label,
      bpm: new Bpm(compact.bpm),
      tracks: compact.tracks.map(track => new Track(track.name, track.fileName, [...track.steps].map(char => char === 'X')))
    };
  }

  static toCompactBeat(beat: Beat): CompactBeat {
    return {
      id: beat.id,
      label: beat.label,
      bpm: beat.bpm.value,
      tracks: beat.tracks.map(track => ({
        name: track.name,
        fileName: track.fileName,
        steps: track.steps.steps.map(x => x? "X":" ").join('')
      }))
    }
  }
}
