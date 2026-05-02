import {Brand} from "./brand";

export type Seconds = Brand<number, "Seconds">;

export const Seconds = (n: number) => n as Seconds;
