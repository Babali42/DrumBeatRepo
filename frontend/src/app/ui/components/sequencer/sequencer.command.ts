export interface Command {
    readonly type: string;
    readonly payload?: unknown;
}
