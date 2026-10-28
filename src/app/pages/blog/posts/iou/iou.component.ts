import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-iou',
  templateUrl: './iou.component.html',
  styleUrl: './iou.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink, NgOptimizedImage],
})
export class IOUPostComponent {}
