import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskFilter',
})
export class TaskFilterPipe implements PipeTransform {
  transform(taskList: any, filterValue: string) {
    if (filterValue.toLowerCase() === 'all' || filterValue == '' || taskList.length === 0) {
      return taskList;
    } else {
      return taskList.filter((task) => task.taskStatus.toLowerCase() === filterValue.toLowerCase());
    }
  }
}
