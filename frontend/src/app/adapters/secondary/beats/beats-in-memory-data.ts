import {BeatsGroupedByGenre} from "../../../domain/beatsGroupedByGenre";
import {CompactBeat} from "../compact-beat";

const metalBeat: CompactBeat = {
  id: "metal",
  label: "Metal",
  bpm: 180,
  genre: "Metal",
  tracks: [
    {
      name: "Snare",
      fileName: "metal/snare.mp3",
      steps: "____X_______X___"
    },
    {
      name: "Hats",
      fileName: "metal/crash.mp3",
      steps: "X___X___X___X___"
    },
    {
      name: "Kick",
      fileName: "metal/kick.mp3",
      steps: "XXXXXXXXXXXXXXXX"
    }
  ]
};

const technoBeat: CompactBeat = {
  id: "techno",
  label: "4 on the floor",
  bpm: 128,
  genre: "Techno",
  tracks: [
    {
      name: "Snare",
      fileName: "techno/snare.wav",
      steps: "____X_______X___"
    },
    {
      name: "Hats",
      fileName: "techno/hat.wav",
      steps: "X_X_X_X_X_X_X_X_"
    },
    {
      name: "Kick",
      fileName: "techno/kick.wav",
      steps: "X   X   X   X   "
    }
  ]
};

const rockBeat: CompactBeat = {
  id: "rock-beat",
  label: "Rock",
  bpm: 145,
  genre: "Metal",
  tracks: [
    {
      name: "Snare",
      fileName: "metal/snare.mp3",
      steps: "    X       X   "
    },
    {
      name: "Hats",
      fileName: "metal/hat.mp3",
      steps: "X   X   X   X   "
    },
    {
      name: "Kick",
      fileName: "metal/kick.mp3",
      steps: "X       X       "
    }
  ]
};

const rockBeatVariation: CompactBeat = {
  id: "rock-beat-variation",
  label: "Rock variation",
  bpm: 145,
  genre: "Metal",
  tracks: [
    {
      name: "Snare",
      fileName: "metal/snare.mp3",
      steps: "    X       X   "
    },
    {
      name: "Crash",
      fileName: "metal/crash.mp3",
      steps: "X   X   X   X   "
    },
    {
      name: "Kick",
      fileName: "metal/kick.mp3",
      steps: "X       X       "
    }
  ]
};

const psytranceBeat: CompactBeat = {
  id: "psytrance",
  label: "Psytrance",
  bpm: 135,
  genre: "Trance",
  tracks: [
    {
      name: "Closed hats",
      fileName: "psytrance/closed-hat.wav",
      steps: "X   X   X   X   "
    },
    {
      name: "Open hats",
      fileName: "psytrance/open-hat.wav",
      steps: "  X   X   X   X "
    },
    {
      name: "Snare",
      fileName: "psytrance/snare.wav",
      steps: "    X       X   "
    },
    {
      name: "Kick",
      fileName: "psytrance/kick.wav",
      steps: "X   X   X   X   "
    },
    {
      name: "Bass",
      fileName: "psytrance/bass.wav",
      steps: " XXX XXX XXX XXX"
    }
  ]
}

const offBeatTechnoClap: CompactBeat = {
  id: "off-beat-techno-clap",
  label: "OffBeat clap",
  bpm: 128,
  genre: "Techno",
  tracks: [
    {
      name: "Clap",
      fileName: "gabber/clap.wav",
      steps: "    X      XX       X      XX   "
    },
    {
      name: "Hats",
      fileName: "techno/hat.wav",
      steps: "  X   X   X   X   X   X   X   X "
    },
    {
      name: "Kick",
      fileName: "techno/kick.wav",
      steps: "X   X   X   X   X   X   X   X   "
    }
  ]
};

const jerseyClubBeat: CompactBeat = {
  id: "jersey-club",
  label: "Jersey club",
  bpm: 140,
  genre: "Breakbeat",
  tracks: [
    {
      name: "Bed squeak (low)",
      fileName: "jersey-club/squeak_low.mp3",
      steps: "X       X       "
    },
    {
      name: "Bed squeak (high)",
      fileName: "jersey-club/squeak_high.mp3",
      steps: "    X       X   "
    },
    {
      name: "Snare",
      fileName: "jersey-club/snare.mp3",
      steps: "X   X   X  X  X "
    },
    {
      name: "Kick",
      fileName: "jersey-club/kick.mp3",
      steps: "X   X   X  X  X "
    }
  ],
  //source: "https://youtu.be/qJtvgAYAuvs?si=ifBHVgsfUL32E2R0"
};

const halfTimeGroove: CompactBeat = {
  id: "half-time-groove",
  label: "Half time groove",
  bpm: 145,
  genre: "Metal",
  tracks: [
    {
      name: "Snare",
      fileName: "metal/snare.mp3",
      steps: "        X       "
    },
    {
      name: "Crash",
      fileName: "metal/crash.mp3",
      steps: "X   X   X   X   "
    },
    {
      name: "Kick",
      fileName: "metal/kick.mp3",
      steps: "X               "
    }
  ]
};

const garageTwoStep: CompactBeat = {
  id: "garage",
  label: "Garage",
  bpm: 130,
  genre: "Garage",
  tracks: [
    {
      name: "Snare",
      fileName: "techno/snare.wav",
      steps: "    X       X   "
    },
    {
      name: "Hats",
      fileName: "techno/hat.wav",
      steps: "  X   X   X   X "
    },
    {
      name: "Kick",
      fileName: "techno/kick.wav",
      steps: "X           X   "
    }
  ]
};

const gabberBeat: CompactBeat = {
  id: "gabber",
  label: "Gabber",
  bpm: 200,
  genre: "Techno",
  tracks: [
    {
      name: "Crash Cymbal",
      fileName: "gabber/crash.wav",
      steps: "                               X"
    },
    {
      name: "Open HiHats",
      fileName: "gabber/open-hihat.wav",
      steps: "X X X X X X X X X X X X X X X X "
    },
    {
      name: "Clap",
      fileName: "gabber/clap.wav",
      steps: "X   X   X   X   X   X   X   X   "
    },
    {
      name: "Kick",
      fileName: "gabber/kick.wav",
      steps: "X   X   X   X   X   X   X   X   "
    }
  ]
};

const ebmBeat: CompactBeat = {
  id: "ebm",
  label: "EBM",
  bpm: 120,
  genre: "Industrial",
  tracks: [
    {
      name: "Clap",
      fileName: "ebm/clap.wav",
      steps: "  X X X   X   XX  XXXX   X X  X "
    },
    {
      name: "Open High-Hat",
      fileName: "ebm/open-hihat.wav",
      steps: "  X   X   X   X   X   X   X   X "
    },
    {
      name: "Closed High-Hat",
      fileName: "ebm/closed-hihat.wav",
      steps: "XX  XX  XX  XX  XX  XX  XX  XX  "
    },
    {
      name: "Snare",
      fileName: "ebm/snare.wav",
      steps: "    X       X       X       X XX"
    },
    {
      name: "Kick",
      fileName: "ebm/kick.wav",
      steps: "X   X   X   X   X   X   X   X   "
    }
  ]
};

const dubBeat: CompactBeat = {
  id: "dub",
  label: "Dub",
  bpm: 140,
  genre: "Dub",
  tracks: [
    {
      name: "Kick",
      fileName: "dub/kick.wav",
      steps: "X_______X_______X_______X_______X_______X_______X_______X_______"
    },
    {
      name: "Sub Bass",
      fileName: "dub/sub.wav",
      steps: "X               X               X               X       X       "
    },
    {
      name: "Skank",
      fileName: "dub/skank.wav",
      steps: "____X_______X_______X_______X_______X_______X_______X_______X___"
    },
    {
      name: "Snare",
      fileName: "dub/snare.wav",
      steps: "        X               X               X               X X     "
    },
    {
      name: "Arpeggio",
      fileName: "dub/arpeggio_si.wav",
      steps: "____X_______X_______X_______X_______X_______X_______X_______X___"
    },
    {
      name: "Closed Hat",
      fileName: "dub/closed-hat.wav",
      steps: "    X X     X       XXX     X       X X     XX      X X     X XX"
    },
    {
      name: "Bass",
      fileName: "dub/bass.wav",
      steps: "X                                         X                     "
    }
  ]
};

const blastBeat: CompactBeat = {
  id: "blast-beat",
  label: "Blast beat",
  bpm: 180,
  genre: "Metal",
  tracks: [
    {
      name: "Snare",
      fileName: "metal/snare.mp3",
      steps: "_X_X_X_X_X_X_X_X"
    },
    {
      name: "Hats",
      fileName: "metal/hat.mp3",
      steps: "X_X_X_X_X_X_X_X_"
    },
    {
      name: "Kick",
      fileName: "metal/kick.mp3",
      steps: "X_X_X_X_X_X_X_X_"
    }
  ]
};

const breakcoreBeat: CompactBeat = {
  id: "breakcore",
  label: "Breakcore",
  bpm: 180,
  genre: "Breakbeat",
  tracks: [
    {
      name: "Snare (accent)",
      fileName: "techno/snare.wav",
      steps: "    X        X  "
    },
    {
      name: "Snare (main)",
      fileName: "drum-n-bass/snare.wav",
      steps: "    X  X X   X  "
    },
    {
      name: "Hats",
      fileName: "techno/hat.wav",
      steps: "XXXXXXXXXXXXXXXX"
    },
    {
      name: "Kick",
      fileName: "techno/kick.wav",
      steps: "X X       XX    "
    }
  ],
  //source: "https://onlinesequencer.net/2502318"
};

const drumAndBassBeat: CompactBeat = {
  id: "drum-n-bass",
  label: "Drum & bass",
  bpm: 170,
  genre: "Garage",
  tracks: [
    {
      name: "Snare",
      fileName: "drum-n-bass/snare.wav",
      steps: "    X       X   "
    },
    {
      name: "Hats",
      fileName: "drum-n-bass/hat.wav",
      steps: "XXXXXXXXXXXXXXXX"
    },
    {
      name: "Kick",
      fileName: "drum-n-bass/kick.wav",
      steps: "X         X     "
    }
  ]
};

const standardDancehallBeat: CompactBeat = {
  id: "dancehall-standard",
  label: "Standard dancehall",
  bpm: 105,
  genre: "Dancehall",
  tracks: [
    {
      name: "Hats",
      fileName: "techno/hat.wav",
      steps: "XXXXXXXXXXXXXXXX"
    },
    {
      name: "Snare",
      fileName: "techno/snare.wav",
      steps: "      X       X "
    },
    {
      name: "Kick",
      fileName: "techno/kick.wav",
      steps: "X  X  X X  X  X "
    }
  ]
};

const reggaetonBeat: CompactBeat = {
  id: "dancehall-reggaeton",
  label: "Reggaeton",
  bpm: 105,
  genre: "Dancehall",
  tracks: [
    {
      name: "Hats",
      fileName: "techno/hat.wav",
      steps: "XXXXXXXXXXXXXXXX"
    },
    {
      name: "Snare",
      fileName: "techno/snare.wav",
      steps: "   X  X    X  X "
    },
    {
      name: "Kick",
      fileName: "techno/kick.wav",
      steps: "X   X   X   X   "
    }
  ]
};

const modernDancehallBeat: CompactBeat = {
  id: "dancehall-modern",
  label: "Modern dancehall",
  bpm: 105,
  genre: "Dancehall",
  tracks: [
    {
      name: "Hats",
      fileName: "techno/hat.wav",
      steps: "XXXXXXXXXXXXXXXX"
    },
    {
      name: "Rim",
      fileName: "techno/snare.wav",
      steps: "   X  X     X   "
    },
    {
      name: "Kick",
      fileName: "techno/kick.wav",
      steps: "X         X     "
    }
  ]
};

const punkBeatQuarterNoteGroove: CompactBeat = {
  id: "punk-beat-quarter-note-groove",
  label: "Quarter note groove",
  bpm: 170,
  genre: "Punk",
  tracks: [
    {
      name: "Hats",
      fileName: "metal/hat.mp3",
      steps: "X___X___X___X___"
    },
    {
      name: "Snare",
      fileName: "metal/snare.mp3",
      steps: "____X_______X___"
    },
    {
      name: "Kick",
      fileName: "metal/kick.mp3",
      steps: "X_______X_______"
    }
  ]
  //source : https://freedrumlessons.com/drum-lessons/punk-drum-beats.php
};

const punkBeatQuarterNoteGrooveVariation: CompactBeat = {
  id: "punk-beat-quarter-note-groove-variation",
  label: "Quarter note groove variation",
  bpm: 170,
  genre: "Punk",
  tracks: [
    {
      name: "Hats",
      fileName: "metal/hat.mp3",
      steps: "X___X___X___X___"
    },
    {
      name: "Snare",
      fileName: "metal/snare.mp3",
      steps: "____X_______X___"
    },
    {
      name: "Kick",
      fileName: "metal/kick.mp3",
      steps: "X_X_____X_X_____"
    }
  ]
  //source : https://freedrumlessons.com/drum-lessons/punk-drum-beats.php
};

const punkBeatEightNoteFill: CompactBeat = {
  id: "punk-beat-eight-note-fill",
  label: "Eight note fill",
  bpm: 170,
  genre: "Punk",
  tracks: [
    {
      name: "Hats",
      fileName: "metal/hat.mp3",
      steps: "X_X_X_X_X_X_X_X_"
    },
    {
      name: "Snare",
      fileName: "metal/snare.mp3",
      steps: "____X_______X___"
    },
    {
      name: "Kick",
      fileName: "metal/kick.mp3",
      steps: "X_X___X_X_X_____"
    }
  ]
  //source : https://freedrumlessons.com/drum-lessons/punk-drum-beats.php
};

export const beatsGroupedByGenre : BeatsGroupedByGenre[] = [
  { label:"Techno", beats: [psytranceBeat, technoBeat, offBeatTechnoClap, gabberBeat]} as BeatsGroupedByGenre,
  { label:"BreakBeat", beats: [breakcoreBeat, jerseyClubBeat]} as BeatsGroupedByGenre,
  { label:"Dancehall", beats: [modernDancehallBeat, standardDancehallBeat, reggaetonBeat]},
  { label:"Garage", beats: [drumAndBassBeat, garageTwoStep]},
  { label:"Dub", beats: [dubBeat]},
  { label:"Indus", beats: [ebmBeat]},
  { label:"Metal", beats: [metalBeat, blastBeat, rockBeatVariation, halfTimeGroove, rockBeat]} as BeatsGroupedByGenre,
  { label:"Punk", beats: [punkBeatQuarterNoteGroove, punkBeatQuarterNoteGrooveVariation, punkBeatEightNoteFill]} as BeatsGroupedByGenre,
];
