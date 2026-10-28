import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-on-poly-stigma',
  templateUrl: './on-poly-stigma.component.html',
  styleUrl: './on-poly-stigma.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink],
})
export class OnPolyStigmaPostComponent {}
