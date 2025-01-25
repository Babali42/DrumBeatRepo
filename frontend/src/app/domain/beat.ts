import { Track } from "./track";

export interface Beat {
  id: string;
  label: string;
  bpm: number;
  tracks: Track[];
  genre: string | undefined;
}
