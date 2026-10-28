import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-music-art',
  templateUrl: './music-art.component.html',
  styleUrl: './music-art.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink],
})
export class MusicArtPostComponent {}
