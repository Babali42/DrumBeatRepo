require('dotenv').config();
const { MongoClient } = require('mongodb');

const metalBeat = {
    id: "metal",
    label: "Metal",
    bpm: 180,
    genre: "Techno",
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
};

const technoBeat = {
    id: "techno",
    label: "4 on the floor",
    bpm: 128,
    genre: "Techno",
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
};

const rockBeat = {
    id: "rock-beat",
    label: "Rock",
    bpm: 145,
    genre: "Metal",
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
};

const rockBeatVariation = {
    id: "rock-beat-variation",
    label: "Rock variation",
    bpm: 145,
    genre: "Metal",
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
};

const psytranceBeat = {
    id: "psytrance",
    label: "Psytrance",
    bpm: 135,
    genre: "Trance",
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
}

const offBeatTechnoClap = {
    id: "off-beat-techno-clap",
    label: "OffBeat clap",
    bpm: 128,
    genre: "Techno",
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
};

const jerseyClubBeat = {
    id: "jersey-club",
    label: "Jersey club",
    bpm: 140,
    genre: "Breakbeat",
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
};

const halfTimeGroove = {
    id: "half-time-groove",
    label: "Half time groove",
    bpm: 145,
    genre: "Metal",
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
};

const garageTwoStep = {
    id: "garage",
    label: "Garage",
    bpm: 130,
    genre: "Garage",
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
};

const gabberBeat = {
    id: "gabber",
    label: "Gabber",
    bpm: 200,
    genre: "Techno",
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
};

const ebmBeat = {
    id: "ebm",
    label: "EBM",
    bpm: 120,
    genre: "Industrial",
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
};

const dubBeat = {
    id: "dub",
    label: "Dub",
    bpm: 140,
    genre: "Dub",
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
};

const blastBeat = {
    id: "blast-beat",
    label: "Blast beat",
    bpm: 180,
    genre: "Metal",
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
};

const breakcoreBeat = {
    id: "breakcore",
    label: "Breakcore",
    bpm: 180,
    genre: "Breakbeat",
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
};

const drumAndBassBeat = {
    id: "drum-n-bass",
    label: "Drum & bass",
    bpm: 170,
    genre: "Garage",
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
};

const standardDancehallBeat = {
    id: "dancehall-standard",
    label: "Standard dancehall",
    bpm: 105,
    genre: "Dancehall",
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
};

const reggaetonBeat = {
    id: "dancehall-reggaeton",
    label: "Reggaeton",
    bpm: 105,
    genre: "Dancehall",
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
};

const modernDancehallBeat = {
    id: "dancehall-modern",
    label: "Modern dancehall",
    bpm: 105,
    genre: "Dancehall",
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
};

const punkBeatQuarterNoteGroove = {
    id: "punk-beat-quarter-note-groove",
    label: "Quarter note groove",
    bpm: 170,
    genre: "Punk",
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
}

const punkBeatQuarterNoteGrooveVariation = {
    id: "punk-beat-quarter-note-groove-variation",
    label: "Quarter note groove variation",
    bpm: 170,
    genre: "Punk",
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
}

const punkBeatEightNoteFill = {
    id: "punk-beat-eight-note-fill",
    label: "Eight note fill",
    bpm: 170,
    genre: "Punk",
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
}

const beats = [modernDancehallBeat, standardDancehallBeat, reggaetonBeat, drumAndBassBeat, breakcoreBeat, blastBeat, dubBeat, ebmBeat, metalBeat, technoBeat, rockBeat, rockBeatVariation, psytranceBeat, offBeatTechnoClap, jerseyClubBeat, halfTimeGroove, garageTwoStep, gabberBeat, punkBeatQuarterNoteGroove, punkBeatQuarterNoteGrooveVariation, punkBeatEightNoteFill];



const seedData = {
    beats: beats,
    // products: [
    //     { name: "Laptop", price: 999 },
    //     { name: "Phone", price: 499 }
    // ]
};

async function seedDatabase() {
    const uri = process.env.DATABASE_CONNECTION_STRING;
    console.log("Database uri :", uri);
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to the database");

        const db = client.db("drum-beat-database");

        for (const [collectionName, documents] of Object.entries(seedData)) {
            const collection = db.collection(collectionName);

            // Optionally clear the collection first
            await collection.deleteMany({});
            console.log(`Cleared collection: ${collectionName}`);

            // Insert seed data
            const result = await collection.insertMany(documents);
            console.log(`Inserted ${result.insertedCount} documents into ${collectionName}`);
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await client.close();
        console.log("Database connection closed");
    }
}

seedDatabase();
