  transform(midiNote: number): string {
    // Mapping from MIDI note numbers to the SVG icons used by the UI.
    // NOTE: Keep this map in sync with the assets present in `src/assets/svg/`.
    const map: { [note: number]: string } = {
      35: 'assets/svg/kick.svg',
      36: 'assets/svg/kick.svg',
      38: 'assets/svg/snare.svg',
      42: 'assets/svg/closed-hat.svg',
      46: 'assets/svg/open-hat.svg',
      // Crash cymbal – MIDI note 49. Added a dedicated SVG asset.
      49: 'assets/svg/crash-cymbal.svg',
      // … other mappings …
    };

    // Return the corresponding SVG path or an empty string if the note is unknown.
    return map[midiNote] ?? '';
  }
}