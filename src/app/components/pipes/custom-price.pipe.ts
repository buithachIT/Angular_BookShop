import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CustomPipePrice',
  standalone: true,
})
export class CustomPipePrice implements PipeTransform {

  transform(value: number) {
    return new Intl.NumberFormat('vi-VN',{
      style: 'currency',currency: 'VND'}).format(value);
  }


}
