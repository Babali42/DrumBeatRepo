# Hexagonal architecture example

````
com/drumbeatrepo/
│
├── shared/                          # Optional: Shared Kernel for truly universal concepts
│   └── domain/
│       ├── MidiDrumType.scala       # Common MIDI types used across contexts
│       └── Velocity.scala           # Shared value object for note velocity
│
├── library/                         # <-- Bounded Context 1: Library Management
│   ├── domain/                      # Core business logic (Pure Scala, no frameworks)
│   │   ├── model/
│   │   │   ├── Beat.scala           
│   │   │   ├── BeatMetadata.scala   
│   │   │   └── Track.scala          # Track context specific to library metadata
│   │   └── exception/
│   ├── application/                 # Use cases and Orchestration
│   │   ├── port/
│   │   │   ├── in/                  # Driving ports (e.g., BeatLibraryService)
│   │   │   └── out/                 # Driven ports (e.g., BeatRepository trait)
│   │   └── LibraryUseCase.scala
│   └── infrastructure/              # Frameworks, HTTP, DB adapters
│       └── adapter/
│           ├── inbound/             # Controllers / API endpoints
│           └── outbound/            # Slick/Doobie DB repositories, file storage
│
└── sequencer/                       # <-- Bounded Context 2: Sequencer Interactive
    ├── domain/                      # Pure state-machine/engine logic
    │   ├── model/
    │   │   ├── Command.scala        # Play, Stop, Pause commands
    │   │   ├── SequencerState.scala # Current tick, active tracks, tempo
    │   │   └── Track.scala          # Track context specific to real-time playback
    │   └── SequencerEngine.scala    # Core pure function engine
    ├── application/
    │   ├── port/
    │   │   ├── in/                  # e.g., RunSequencerCommand
    │   │   └── out/                 # e.g., LoadBeatPort (interface to fetch music)
    │   └── SequencerService.scala
    └── infrastructure/
        └── adapter/
            ├── inbound/             # WebSockets, CLI, or UI interactive handlers
            └── outbound/            # HTTP client implementations
                └── HttpBeatLoader.scala  # Moved here! It implements LoadBeatPort
````