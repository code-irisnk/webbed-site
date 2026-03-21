import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-iou',
  templateUrl: './iou.component.html',
  styleUrl: './iou.component.scss',
  standalone: true,
  imports: [RouterLink],
})
export class IOUPostComponent {}
