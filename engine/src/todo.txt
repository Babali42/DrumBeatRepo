I'd avoid mocking `Fetch` directly. Your `SelectBeat` command has a very small infrastructure dependency: HTTP fetching. The cleanest solution is to inject the beat-loading effect into `SequencerState`, so you can test the state transition independently from the browser.

Since you're using Cats Effect and Scala 3, I'd go with a functional approach.

## 1. Extract beat loading into a dependency

Create a small abstraction:

```
trait BeatLoader:
  def load(filename: String): IO[Beat]
```

Production implementation:

```
final class HttpBeatLoader extends BeatLoader:

  override def load(filename: String): IO[Beat] =
    for
      response <- IO.fromFuture(
        IO(Fetch.fetch(s"/assets/beats/$filename.json").toFuture)
      )
      text <- IO.fromFuture(IO(response.text().toFuture))
      beat <- IO.fromEither(decode[Beat](text))
    yield beat
```

Now your `SequencerState` receives the dependency.

```
def dispatch(command: Command, beatLoader: BeatLoader): IO[SequencerState] =
  command match
    case Command.SelectBeat(newFilename) =>
      for
        beat <- beatLoader.load(newFilename)
      yield SequencerState(
        beat.genre,
        beat.label,
        beat.tracks.map(x =>
          Track(
            x.name,
            x.filename,
            x.midiNote,
            x.steps.toCharArray
              .map(c => if c == 'X' then Velocity.Normal else Velocity.None)
              .toList,
            x.isMuted.getOrElse(false),
            x.isSolo.getOrElse(false)
          )
        ),
        beat.bpm,
        beat.beatsPerBar,
        beat.subdivisionsPerBeat,
        beat.numberOfBar,
        history :+ this,
        Nil
      )

    // Other commands...
```

You could also inject `BeatLoader` into a `Sequencer` service rather than passing it to every dispatch call. That would be my preference for a larger application.

## 2. Write a fake BeatLoader

You don't need Mockito, ScalaMock, or any mocking framework here.

A simple fake is enough:

```
final class FakeBeatLoader(beat: Beat) extends BeatLoader:

  var requestedFilename: Option[String] = None

  override def load(filename: String): IO[Beat] =
    IO {
      requestedFilename = Some(filename)
      beat
    }
```

## 3. Write your unit test

Using ScalaTest:

```
test("SelectBeat should load a beat and update the sequencer state") {

  val beat = Beat(
    genre = "Techno",
    label = "Tresillo",
    tracks = List(
      // Your test track
    ),
    bpm = 128,
    beatsPerBar = 4,
    subdivisionsPerBeat = 4,
    numberOfBar = 1
  )

  val loader = new FakeBeatLoader(beat)

  val initialState = SequencerState.initial

  for
    result <- initialState.dispatch(
      Command.SelectBeat("tresillo"),
      loader
    )
  yield
    assert(result.genre == "Techno")
    assert(result.beat == "Tresillo")
    assert(result.tempo == 128)
    assert(result.history == List(initialState))
    assert(result.future.isEmpty)
    assert(loader.requestedFilename.contains("tresillo"))
}
```

This tests:

- The requested filename.
- The mapping from `Beat` to `SequencerState`.
- History management.
- Future clearing.

## 4. Test error handling too

One nice property of `IO` is that you can test failures without throwing exceptions manually.

For example:

```
final class FailingBeatLoader extends BeatLoader:

  override def load(filename: String): IO[Beat] =
    IO.raiseError(new RuntimeException("Network error"))
```

Test:

```
test("SelectBeat should fail when loading a beat fails") {

  val loader = new FailingBeatLoader

  val result = SequencerState.initial.dispatch(
    Command.SelectBeat("missing"),
    loader
  )

  result.attempt.map {
    case Left(error) =>
      assert(error.getMessage == "Network error")

    case Right(_) =>
      fail("Expected loading to fail")
  }
}
```

## My architectural recommendation

There's actually a more interesting design opportunity here.

Your `SequencerState` currently mixes two responsibilities:

1. Pure state transitions (`ToggleStep`, `SetTempo`, `Undo`, etc.).
2. Side effects (`SelectBeat` performs HTTP).

I'd consider separating them:

Sequencer

Orchestrates commands and effects

BeatLoader

HTTP / JSON decoding

SequencerState

Pure state transitions and history

For example, `SelectBeat` could be handled by the orchestration layer:

```
def execute(state: SequencerState, command: Command): IO[SequencerState] =
  command match
    case Command.SelectBeat(filename) =>
      for
        beat <- beatLoader.load(filename)
      yield state.selectBeat(beat)

    case other =>
      IO.pure(state.dispatchPure(other))
```

Now you can test almost all your sequencer logic without Cats Effect's runtime, mocks, or asynchronous tests.

My vote: start with `BeatLoader` injection. It's a small refactoring that makes your current code testable immediately. Then consider separating pure transitions from effects as the Scala engine grows. That's a particularly nice fit for your hexagonal architecture.