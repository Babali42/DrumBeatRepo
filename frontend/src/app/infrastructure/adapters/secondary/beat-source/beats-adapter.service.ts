import {CompactBeat} from "./compact-beat";

const metalBeat: CompactBeat = {
  label: "Metal",
  genre: "Metal",
  bpm: 180,
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
  label: "4 on the floor",
  genre: "Techno",
  bpm: 128,
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
  label: "Rock",
  genre: "Rock",
  bpm: 145,
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
      steps: "X X       X     "
    }
  ]
};

const rockBeatVariation: CompactBeat = {
  label: "Rock variation",
  genre: "Rock",
  bpm: 145,
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
  label: "Psytrance",
  genre: "Psytrance",
  bpm: 135,
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
  label: "OffBeat clap",
  genre: "Techno",
  bpm: 128,
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
  label: "Jersey club",
  genre: "Club",
  bpm: 140,
  tracks: [
    {
      name: "Bed squeak (low)",
      fileName: "jersey-club/squeak_low.mp3",
      steps: "X   X   X   X   "
    },
    {
      name: "Bed squeak (high)",
      fileName: "jersey-club/squeak_high.mp3",
      steps: "__X___X___X___X_"
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
  label: "Half time groove",
  genre: "Metal",
  bpm: 145,
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

const twoStep: CompactBeat = {
  label: "Two step",
  genre: "hiphop",
  bpm: 130,
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
  label: "Gabber",
  genre: "Techno Hardcore",
  bpm: 200,
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
  label: "EBM",
  genre: "Indus",
  bpm: 120,
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
  label: "Dub",
  genre: "Dub",
  bpm: 140,
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
  label: "Blast beat",
  genre: "Metal",
  bpm: 180,
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
  label: "Breakcore",
  genre: "breakcore",
  bpm: 180,
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
  label: "Drum & bass",
  genre: "drum",
  bpm: 170,
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
  label: "Standard dancehall",
  genre: "dancehall",
  bpm: 105,
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
  label: "Reggaeton",
  genre: "dancehall",
  bpm: 105,
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
  label: "Modern dancehall",
  genre: "dancehall",
  bpm: 105,
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
  label: "Quarter note groove",
  genre: "punk",
  bpm: 170,
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
  label: "Quarter note groove variation",
  genre: "punk",
  bpm: 170,
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
  label: "Eight note fill",
  genre: "punk",
  bpm: 170,
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

export const beats : readonly CompactBeat[] = [
  technoBeat,
  offBeatTechnoClap,
  rockBeat,
  rockBeatVariation,
  punkBeatQuarterNoteGroove, punkBeatQuarterNoteGrooveVariation, punkBeatEightNoteFill,
  metalBeat, blastBeat, halfTimeGroove,
  breakcoreBeat, drumAndBassBeat, twoStep,
  modernDancehallBeat, standardDancehallBeat,
  psytranceBeat,
  gabberBeat,
  reggaetonBeat,
  dubBeat,
  ebmBeat,
  jerseyClubBeat,
];
