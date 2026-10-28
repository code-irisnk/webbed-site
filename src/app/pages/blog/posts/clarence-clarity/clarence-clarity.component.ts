import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-clarence-clarity',
  templateUrl: './clarence-clarity.component.html',
  styleUrl: './clarence-clarity.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink],
})
export class ClarenceClarityPostComponent {}
