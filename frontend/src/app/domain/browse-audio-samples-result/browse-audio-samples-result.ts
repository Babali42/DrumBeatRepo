import { Mp3Filename } from "../filenames/mp3.filepath";
import { WavFilename } from "../filenames/wav.filepath";

export interface BrowseAudioSamplesModalResult {
    alreadyLoadedTracks: Map<String, Mp3Filename | WavFilename>
}

export const DefaultBrowseAudioSamplesModalResult: BrowseAudioSamplesModalResult = {
    alreadyLoadedTracks: new Map<String, Mp3Filename | WavFilename>()
}