import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'averageRating', standalone: true })
export class AverageRatingPipe implements PipeTransform {
  transform(feedbacks: any[]): number {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return +(sum / feedbacks.length).toFixed(1);
  }
}