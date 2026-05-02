import {Brand} from "./brand";

export type StepIndex = Brand<number, "StepIndex">;

export const StepIndex = (n: number) => n as StepIndex;
