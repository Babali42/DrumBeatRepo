import {CompactBeat} from "./compact-beat";

export class BeatUrlMapper {
  static toBase64(user: CompactBeat): string {
    const json = JSON.stringify(user);
    return btoa(encodeURIComponent(json)); // URI-safe
  }

  static fromBase64(base64: string): CompactBeat {
    const json = decodeURIComponent(atob(base64));
    return JSON.parse(json) as CompactBeat;
  }
}
