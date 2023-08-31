import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'msToTime'
})
export class MsToTimePipe implements PipeTransform {

  transform(value: number): string {
    if (!value) {
      return '00:00:00';
    }
    const milliseconds = Math.floor((value % 1000)).toString().padStart(3, '0');
    const seconds = Math.floor((value / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((value / (1000 * 60)) % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}:${milliseconds}`;
  }

}
