import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'drumImage',
  standalone: true
})
export class DrumImagePipe implements PipeTransform {
  transform(midiNote: number): string {
    const map: { [note: number]: string } = {
      35: 'assets/svg/kick.svg',
      36: 'assets/svg/kick.svg',
      38: 'assets/svg/snare.svg',
      42: 'assets/svg/closed-hat.svg',
      46: 'assets/svg/open-hat.svg',
      49: 'assets/svg/crash-cymbal.svg',
    };

    return map[midiNote] ?? '';
  }
}
