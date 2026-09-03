import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-music-art',
  templateUrl: './music-art.component.html',
  styleUrl: './music-art.component.scss',
  standalone: true,
  imports: [RouterLink],
})
export class MusicArtPostComponent {}
