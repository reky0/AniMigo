import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
  standalone: true // important for modern Angular (no NgModule needed)
})
export class RangePipe implements PipeTransform {
  transform(count: number, start: number = 1): number[] {
    return Array.from({ length: count }, (_, i) => i + start);
  }
}
