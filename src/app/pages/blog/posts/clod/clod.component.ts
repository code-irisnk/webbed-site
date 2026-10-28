import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-clod',
  templateUrl: './clod.component.html',
  styleUrl: './clod.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink],
})
export class ClodPostComponent {}
