import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CommonModule } from '@angular/common';
import badgesData from '../../assets/88x31.json'; // relative path to TS file... why are you like this javascript????

interface Badge {
  href?: string;
  src: string;
  alt: string;
}

@Component({
  selector: 'app-eighty-eight',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './eighty-eight.component.html',
  styleUrls: ['./eighty-eight.component.scss'],
})
export class EightyEightComponent {
  readonly badges: Badge[] = badgesData;
}
