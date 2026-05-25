import {Beat} from "../beat";

export interface IMidi {
    exportBeat(beat: Beat): Promise<Blob>;
}
