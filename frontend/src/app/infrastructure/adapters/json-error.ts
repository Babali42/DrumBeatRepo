class JsonError {
    readonly _tag = "JsonError";

    constructor(
        readonly message: string,
        readonly cause?: unknown
    ) { }
}