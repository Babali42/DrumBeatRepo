# 🥁 Drum Beat Repository  
*A library of drum patterns for music lovers / Une bibliothèque rythmique pour les mélomanes 🎵*

Welcome to **Drum Beat Repository**, a web-based project for musicians to explore and create drum patterns. Built with **Angular** and the **Web Audio API**, this interactive tool delivers a smooth, in-browser drum sequencing experience.

👉 **Try it now:** [www.drumbeatrepo.com](https://www.drumbeatrepo.com/#/)

![App Screenshot](./app.png)

---

## 🤝 Contributing

### How to add your own beat ?

- Check this issue which contains some ideas : https://github.com/Babali42/DrumBeatRepo/issues/270
- Find a new genre or subgenre and verify it's not present yet
  - Either :
    - Add it to the issue above and I'll take care of it
    - Continue with step below
- Add a new .json file in the [assets/beats/GENRE](https://github.com/Babali42/DrumBeatRepo/tree/main/frontend/src/assets/beats) folder 
- Define genre, subgenres, samples, tracks and patterns in the file :
```
  {
  "label": "Half time groove",
  "genre": "Metal",
  "bpm": 145,
  "tracks": [
    {
      "name": "Snare",
      "fileName": "metal/snare.mp3",
      "steps": "        X       "
    },
    {
      "name": "Crash",
      "fileName": "metal/crash.mp3",
      "steps": "X   X   X   X   "
    },
    {
      "name": "Kick",
      "fileName": "metal/kick.mp3",
      "steps": "X               "
    }
  ]
}
```
- Sounds samples are here (try mix them !)
```
  drum-n-bass
    hat.wav
    kick.wav
    snare.wav
  dub
    arpeggio_si.wav
    bass.wav
    closed-hat.wav
    kick.wav
    pattern (bitinvader=bass et SID=arpeggio).png
    skank.wav
    snare.wav
    sub.wav
  ebm
    clap.wav
    closed-hihat.wav
    kick.wav
    open-hihat.wav
    snare.wav
  gabber
    clap.wav
    crash.wav
    kick.wav
    kick.wav.asd
    open-hihat.wav
  jersey-club
    kick.mp3
    snare.mp3
    squeak_high.mp3
    squeak_low.mp3
  metal
    crash.mp3
    crash.wav
    hat.mp3
    hat.wav
    kick.mp3
    kick.wav
    snare.mp3
    snare.wav
  psytrance
    bass.wav
    closed-hat.wav
    kick.wav
    open-hat.wav
    snare.wav
  techno
    hat.wav
    kick.wav
    snare.wav
```
- Add your files in this string list
```typescript
  loadAllJson(): Observable<CompactBeat[]> {
    let files = ['techno/techno.json', 'techno/off-beat-clap.json'];
    files = files.concat('metal/metal.json', 'metal/metal-blastbeat.json', 'metal/half-time-groove.json');
    files = files.concat('rock/rock.json', 'rock/variation.json');
    files = files.concat('punk/punk-beat-quarter-note-groove.json', 'punk/punk-beat-quarter-note-groove-variation.json', 'punk/punk-beat-eight-note-fill.json');
    files = files.concat('psytrance/psytrance.json');
    files = files.concat('dancehall/standard.json');
    files = files.concat('techno-hardcore/gabber.json');
    files = files.concat('dub/dub.json');
```
- `cd frontend`
- `npm i`
- `npm run start`
- Verify the beat
- Open a PR !

### Thanks to the contributors
- **Kireo**
- **GiaHuy0031**  
  ...and everyone who's shared feedback and ideas ❤️

---

## 📄 License

- **Code**: Licensed under the [GNU General Public License](./LICENSE).  
- **Non-code content** (UI concepts, beats, etc.): Licensed under a [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license.
