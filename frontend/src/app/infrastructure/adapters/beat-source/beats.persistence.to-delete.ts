import {CompactBeat} from "./compact-beat";

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

const twoStep: CompactBeat = {
  label: "Two step",
  genre: "BreakBeat",
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

const breakcoreBeat: CompactBeat = {
  label: "Breakcore",
  genre: "BreakBeat",
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
  genre: "BreakBeat",
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

const reggaetonBeat: CompactBeat = {
  label: "Reggaeton",
  genre: "Reggaeton",
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
  genre: "Dancehall",
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

export const beats : readonly CompactBeat[] = [
  breakcoreBeat, drumAndBassBeat, twoStep,
  modernDancehallBeat,
  reggaetonBeat,
  ebmBeat,
  jerseyClubBeat,
];
