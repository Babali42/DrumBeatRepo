import {CompactTrack} from "./compact-track";
import {Beat} from "../../domain/beat";

export type CompactBeat = {
  id: string;
  label: string;
  bpm: number;
  genre: string;
  tracks: CompactTrack[];
};

export function expandCompactBeat(compact: CompactBeat): Beat {
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
