import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-i-like-music-2025',
  templateUrl: './i-like-music-2025.component.html',
  styleUrl: './i-like-music-2025.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink, NgOptimizedImage],
})
export class ILikeMusic2025PostComponent {}
