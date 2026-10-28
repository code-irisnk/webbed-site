import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-because-the-internet',
  templateUrl: './because-the-internet.component.html',
  styleUrl: './because-the-internet.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink],
})
export class BecauseTheInternetPostComponent {}
