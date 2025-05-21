import {CompactTrack} from "./compact-track";

export type CompactBeat = {
  id: string;
  label: string;
  bpm: number;
  genre: string;
  tracks: CompactTrack[];
}
