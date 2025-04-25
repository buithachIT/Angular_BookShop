import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CustomNamePipe',
  standalone: true,
})
export class CustomNamePipe implements PipeTransform {
  
  transform(value: string, ellipsis: string = "..."): string {
    if (!value) return '';
    if (value.length > 25) {
      return value.slice(0, 25) + ellipsis;
    }
    return value;
  }

}

