import { Effect } from "effect";
import { Beat } from "../beat";
import { HttpErrorResponse } from "@angular/common/http";

export default interface IManageBeats {
  readonly getAllBeats: () => Effect.Effect<Beat[], HttpErrorResponse | Error>
}
