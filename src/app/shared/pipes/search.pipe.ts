import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: any, categoryValue: string): any {
    //start condition if filter is empty or undefined
    if (
      value.length === 0 ||
      categoryValue === undefined ||
      categoryValue === '' ||
      categoryValue === 'all'
    ) {
      return value;
    }
    //if it is not empty for loop for all products to find category equals filter
    const newResult = [];
    for (let item of value) {
      //these are the condition for search bars each keyup event value if one of them equals or includes value. then result filtered.
      if (
        item.category.toUpperCase().includes(categoryValue.toUpperCase()) ||
        item.title.toUpperCase().includes(categoryValue.toUpperCase()) ||
        item.price <= categoryValue
      ) {
        newResult.push(item);
      }
    }
    //return new result array
    return newResult;
  }
}
