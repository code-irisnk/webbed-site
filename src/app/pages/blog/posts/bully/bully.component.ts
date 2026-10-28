import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-bully',
  templateUrl: './bully.component.html',
  styleUrl: './bully.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink],
})
export class BullyPostComponent {}
