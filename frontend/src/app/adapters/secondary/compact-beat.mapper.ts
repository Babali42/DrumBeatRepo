import {Beat} from "../../domain/beat";
import {CompactBeat} from "./compact-beat";

export class CompactBeatMapper {
  static toBeat(compact: CompactBeat): Beat {
    return {
      id: compact.id,
      label: compact.label,
      bpm: compact.bpm,
      genre: compact.genre,
      tracks: compact.tracks.map(track => ({
        name: track.name,
        fileName: track.fileName,
        steps: [...track.steps].map(char => char === 'X')
      }))
    };
  }

  static toCompactBeat(beat: Beat): CompactBeat {
    return {
      id: beat.id,
      label: beat.label,
      bpm: beat.bpm,
      genre: beat.genre,
      tracks: beat.tracks.map(track => ({
        name: track.name,
        fileName: track.fileName,
        steps: track.steps.map(x => x? "X":" ").join()
      }))
    }
  }
}
