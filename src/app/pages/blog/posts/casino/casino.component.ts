import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-casino',
  templateUrl: './casino.component.html',
  styleUrl: './casino.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink, NgOptimizedImage],
})
export class CasinoPostComponent {}
