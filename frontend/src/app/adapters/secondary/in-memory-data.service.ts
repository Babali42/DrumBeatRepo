import {InMemoryDbService} from "angular-in-memory-web-api";
import {Injectable} from "@angular/core";
import {Beat} from "../../domain/beat";
import {Genre} from "../../domain/genre";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(): NonNullable<unknown> {
    const metalBeat: Beat = {
      id: "metal",
      label: "Metal",
      bpm: 180,
      tracks: [
        {
          name: "Snare",
          fileName: "metal/snare.mp3",
          steps: "____X_______X___".split('').map(step => step === 'X')
        },
        {
          name: "Hats",
          fileName: "metal/crash.mp3",
          steps: "X___X___X___X___".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "metal/kick.mp3",
          steps: "XXXXXXXXXXXXXXXX".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const technoBeat: Beat = {
      id: "techno",
      label: "4 on the floor",
      bpm: 128,
      tracks: [
        {
          name: "Snare",
          fileName: "techno/snare.wav",
          steps: "____X_______X___".split('').map(step => step === 'X')
        },
        {
          name: "Hats",
          fileName: "techno/hat.wav",
          steps: "X_X_X_X_X_X_X_X_".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "techno/kick.wav",
          steps: "X   X   X   X   ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const rockBeat: Beat = {
      id: "rock-beat",
      label: "Rock",
      bpm: 145,
      tracks: [
        {
          name: "Snare",
          fileName: "metal/snare.mp3",
          steps: "    X       X   ".split('').map(step => step === 'X')
        },
        {
          name: "Hats",
          fileName: "metal/hat.mp3",
          steps: "X   X   X   X   ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "metal/kick.mp3",
          steps: "X       X       ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const rockBeatVariation: Beat = {
      id: "rock-beat-variation",
      label: "Rock variation",
      bpm: 145,
      tracks: [
        {
          name: "Snare",
          fileName: "metal/snare.mp3",
          steps: "    X       X   ".split('').map(step => step === 'X')
        },
        {
          name: "Crash",
          fileName: "metal/crash.mp3",
          steps: "X   X   X   X   ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "metal/kick.mp3",
          steps: "X       X       ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const psytranceBeat: Beat = {
      id: "psytrance",
      label: "Psytrance",
      bpm: 135,
      tracks: [
        {
          name: "Closed hats",
          fileName: "psytrance/closed-hat.wav",
          steps: "X   X   X   X   ".split('').map(step => step === 'X')
        },
        {
          name: "Open hats",
          fileName: "psytrance/open-hat.wav",
          steps: "  X   X   X   X ".split('').map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "psytrance/snare.wav",
          steps: "    X       X   ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "psytrance/kick.wav",
          steps: "X   X   X   X   ".split('').map(step => step === 'X')
        },
        {
          name: "Bass",
          fileName: "psytrance/bass.wav",
          steps: " XXX XXX XXX XXX".split('').map(step => step === 'X')
        }
      ]
    } as Beat

    const offBeatTechnoClap: Beat = {
      id: "off-beat-techno-clap",
      label: "OffBeat clap",
      bpm: 128,
      tracks: [
        {
          name: "Clap",
          fileName: "gabber/clap.wav",
          steps: "    X      XX       X      XX   ".split('').map(step => step === 'X')
        },
        {
          name: "Hats",
          fileName: "techno/hat.wav",
          steps: "  X   X   X   X   X   X   X   X ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "techno/kick.wav",
          steps: "X   X   X   X   X   X   X   X   ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const jerseyClubBeat: Beat = {
      id: "jersey-club",
      label: "Jersey club",
      bpm: 140,
      tracks: [
        {
          name: "Bed squeak (low)",
          fileName: "jersey-club/squeak_low.mp3",
          steps: "X       X       ".split('').map(step => step === 'X')
        },
        {
          name: "Bed squeak (high)",
          fileName: "jersey-club/squeak_high.mp3",
          steps: "    X       X   ".split('').map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "jersey-club/snare.mp3",
          steps: "X   X   X  X  X ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "jersey-club/kick.mp3",
          steps: "X   X   X  X  X ".split('').map(step => step === 'X')
        }
      ],
      //source: "https://youtu.be/qJtvgAYAuvs?si=ifBHVgsfUL32E2R0"
    } as Beat;

    const halfTimeGroove: Beat = {
      id: "half-time-groove",
      label: "Half time groove",
      bpm: 145,
      tracks: [
        {
          name: "Snare",
          fileName: "metal/snare.mp3",
          steps: "        X       ".split('').map(step => step === 'X')
        },
        {
          name: "Crash",
          fileName: "metal/crash.mp3",
          steps: "X   X   X   X   ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "metal/kick.mp3",
          steps: "X               ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const garageTwoStep: Beat = {
      id: "garage",
      label: "Garage",
      bpm: 130,
      tracks: [
        {
          name: "Snare",
          fileName: "techno/snare.wav",
          steps: "    X       X   ".split('').map(step => step === 'X')
        },
        {
          name: "Hats",
          fileName: "techno/hat.wav",
          steps: "  X   X   X   X ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "techno/kick.wav",
          steps: "X           X   ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const gabberBeat: Beat = {
      id: "gabber",
      label: "Gabber",
      bpm: 200,
      tracks: [
        {
          name: "Crash Cymbal",
          fileName: "gabber/crash.wav",
          steps: "                               X".split('').map(step => step === 'X')
        },
        {
          name: "Open HiHats",
          fileName: "gabber/open-hihat.wav",
          steps: "X X X X X X X X X X X X X X X X ".split('').map(step => step === 'X')
        },
        {
          name: "Clap",
          fileName: "gabber/clap.wav",
          steps: "X   X   X   X   X   X   X   X   ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "gabber/kick.wav",
          steps: "X   X   X   X   X   X   X   X   ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const ebmBeat: Beat = {
      id: "ebm",
      label: "EBM",
      bpm: 120,
      tracks: [
        {
          name: "Clap",
          fileName: "ebm/clap.wav",
          steps: [" ", " ", "X", " ", "X", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", "X", " ", " ", "X", "X", "X", "X", " ", " ", " ", "X", " ", "X", " ", " ", "X", " "]
            .map(step => step === 'X')
        },
        {
          name: "Open High-Hat",
          fileName: "ebm/open-hihat.wav",
          steps: [" ", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", " "]
            .map(step => step === 'X')
        },
        {
          name: "Closed High-Hat",
          fileName: "ebm/closed-hihat.wav",
          steps: ["X", "X", " ", " ", "X", "X", " ", " ", "X", "X", " ", " ", "X", "X", " ", " ", "X", "X", " ", " ", "X", "X", " ", " ", "X", "X", " ", " ", "X", "X", " ", " "]
            .map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "ebm/snare.wav",
          steps: "    X       X       X       X XX".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "ebm/kick.wav",
          steps: "X   X   X   X   X   X   X   X   ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const dubBeat: Beat = {
      id: "dub",
      label: "Dub",
      bpm: 140,
      tracks: [
        {
          name: "Kick",
          fileName: "dub/kick.wav",
          steps: "X_______X_______X_______X_______X_______X_______X_______X_______".split('').map(step => step === 'X')
        },
        {
          name: "Sub Bass",
          fileName: "dub/sub.wav",
          steps: ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " "]
            .map(step => step === 'X'),
        },
        {
          name: "Skank",
          fileName: "dub/skank.wav",
          steps: "____X_______X_______X_______X_______X_______X_______X_______X___".split('').map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "dub/snare.wav",
          steps: [" ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", "X", " ", " ", " ", " ", " "]
            .map(step => step === 'X'),
        },
        {
          name: "Arpeggio",
          fileName: "dub/arpeggio_si.wav",
          steps: "____X_______X_______X_______X_______X_______X_______X_______X___".split('').map(step => step === 'X')
        },
        {
          name: "Closed Hat",
          fileName: "dub/closed-hat.wav",
          steps: [" ", " ", " ", " ", "X", " ", "X", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", "X", "X", "X", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", "X", " ", "X", " ", " ", " ", " ", " ", "X", "X", " ", " ", " ", " ", " ", " ", "X", " ", "X", " ", " ", " ", " ", " ", "X", " ", "X", "X"]
            .map(step => step === 'X'),
        },
        {
          name: "Bass",
          fileName: "dub/bass.wav",
          steps: "X                                         X                     ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const blastBeat: Beat = {
      id: "blast-beat",
      label: "Blast beat",
      bpm: 180,
      tracks: [
        {
          name: "Snare",
          fileName: "metal/snare.mp3",
          steps: "_X_X_X_X_X_X_X_X".split('').map(step => step === 'X')
        },
        {
          name: "Hats",
          fileName: "metal/hat.mp3",
          steps: "X_X_X_X_X_X_X_X_".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "metal/kick.mp3",
          steps: "X_X_X_X_X_X_X_X_".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const breakcoreBeat: Beat = {
      id: "breakcore",
      label: "Breakcore",
      bpm: 180,
      tracks: [
        {
          name: "Snare (accent)",
          fileName: "techno/snare.wav",
          steps: "    X        X  ".split('').map(step => step === 'X')
        },
        {
          name: "Snare (main)",
          fileName: "drum-n-bass/snare.wav",
          steps: "    X  X X   X  ".split('').map(step => step === 'X')
        },
        {
          name: "Hats",
          fileName: "techno/hat.wav",
          steps: "XXXXXXXXXXXXXXXX".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "techno/kick.wav",
          steps: "X X       XX    ".split('').map(step => step === 'X')
        }
      ],
      //source: "https://onlinesequencer.net/2502318"
    } as Beat;

    const drumAndBassBeat: Beat = {
      id: "drum-n-bass",
      label: "Drum & bass",
      bpm: 170,
      tracks: [
        {
          name: "Snare",
          fileName: "drum-n-bass/snare.wav",
          steps: "    X       X   ".split('').map(step => step === 'X')
        },
        {
          name: "Hats",
          fileName: "drum-n-bass/hat.wav",
          steps: "XXXXXXXXXXXXXXXX".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "drum-n-bass/kick.wav",
          steps: "X         X     ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const standardDancehallBeat: Beat = {
      id: "dancehall-standard",
      label: "Standard dancehall",
      bpm: 105,
      tracks: [
        {
          name: "Hats",
          fileName: "techno/hat.wav",
          steps: "XXXXXXXXXXXXXXXX".split('').map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "techno/snare.wav",
          steps: "      X       X ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "techno/kick.wav",
          steps: "X  X  X X  X  X ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const reggaetonBeat: Beat = {
      id: "dancehall-reggaeton",
      label: "Reggaeton",
      bpm: 105,
      tracks: [
        {
          name: "Hats",
          fileName: "techno/hat.wav",
          steps: "XXXXXXXXXXXXXXXX".split('').map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "techno/snare.wav",
          steps: "   X  X    X  X ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "techno/kick.wav",
          steps: "X   X   X   X   ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const modernDancehallBeat: Beat = {
      id: "dancehall-modern",
      label: "Modern dancehall",
      bpm: 105,
      tracks: [
        {
          name: "Hats",
          fileName: "techno/hat.wav",
          steps: "XXXXXXXXXXXXXXXX".split('').map(step => step === 'X')
        },
        {
          name: "Rim",
          fileName: "techno/snare.wav",
          steps: "   X  X     X   ".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "techno/kick.wav",
          steps: "X         X     ".split('').map(step => step === 'X')
        }
      ]
    } as Beat;

    const punkBeatQuarterNoteGroove: Beat = {
      id: "punk-beat-quarter-note-groove",
      label: "Quarter note groove",
      bpm: 170,
      tracks: [
        {
          name: "Hats",
          fileName: "metal/hat.mp3",
          steps: "X___X___X___X___".split('').map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "metal/snare.mp3",
          steps: "____X_______X___".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "metal/kick.mp3",
          steps: "X_______X_______".split('').map(step => step === 'X')
        }
      ]
      //source : https://freedrumlessons.com/drum-lessons/punk-drum-beats.php
    } as Beat

    const punkBeatQuarterNoteGrooveVariation: Beat = {
      id: "punk-beat-quarter-note-groove-variation",
      label: "Quarter note groove variation",
      bpm: 170,
      tracks: [
        {
          name: "Hats",
          fileName: "metal/hat.mp3",
          steps: "X___X___X___X___".split('').map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "metal/snare.mp3",
          steps: "____X_______X___".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "metal/kick.mp3",
          steps: "X_X_____X_X_____".split('').map(step => step === 'X')
        }
      ]
      //source : https://freedrumlessons.com/drum-lessons/punk-drum-beats.php
    } as Beat

    const punkBeatEightNoteFill: Beat = {
      id: "punk-beat-eight-note-fill",
      label: "Eight note fill",
      bpm: 170,
      tracks: [
        {
          name: "Hats",
          fileName: "metal/hat.mp3",
          steps: "X_X_X_X_X_X_X_X_".split('').map(step => step === 'X')
        },
        {
          name: "Snare",
          fileName: "metal/snare.mp3",
          steps: "____X_______X___".split('').map(step => step === 'X')
        },
        {
          name: "Kick",
          fileName: "metal/kick.mp3",
          steps: "X_X___X_X_X_____".split('').map(step => step === 'X')
        }
      ]
      //source : https://freedrumlessons.com/drum-lessons/punk-drum-beats.php
    } as Beat

    const beats: Beat[] = [modernDancehallBeat, standardDancehallBeat, reggaetonBeat, drumAndBassBeat, breakcoreBeat, blastBeat, dubBeat, ebmBeat, metalBeat, technoBeat, rockBeat, rockBeatVariation, psytranceBeat, offBeatTechnoClap, jerseyClubBeat, halfTimeGroove, garageTwoStep, gabberBeat];

    const genres: Genre[] = [
      {
        label: "Techno",
        beats: [technoBeat, gabberBeat, offBeatTechnoClap]
      },
      {
        label: "Garage",
        beats: [garageTwoStep, drumAndBassBeat]
      },
      {
        label: "Breakbeat",
        beats: [jerseyClubBeat, breakcoreBeat]
      },
      {
        label: "Dancehall",
        beats: [reggaetonBeat, standardDancehallBeat, modernDancehallBeat]
      },
      {
        label: "Trance",
        beats: [psytranceBeat]
      },
      {
        label: "Dub",
        beats: [dubBeat]
      },
      {
        label: "Indus",
        beats: [ebmBeat]
      },
      {
        label: "Metal",
        beats: [metalBeat, halfTimeGroove, rockBeat, rockBeatVariation, blastBeat]
      },
      {
        label: "Punk",
        beats: [punkBeatQuarterNoteGroove, punkBeatQuarterNoteGrooveVariation, punkBeatEightNoteFill]
      }
    ];


    return {genres, beats};
  }
}
