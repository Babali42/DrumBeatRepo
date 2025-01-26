import { Track } from "./track";

export interface Beat {
  id: string;
  label: string;
  bpm: number;
  genre: string;
  tracks: Track[];
}
