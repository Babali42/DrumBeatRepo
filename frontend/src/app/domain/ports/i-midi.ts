import {Beat} from "../beat";

export interface IMidi {
    readonly exportBeat : (beat: Beat) => Promise<Blob>
}
