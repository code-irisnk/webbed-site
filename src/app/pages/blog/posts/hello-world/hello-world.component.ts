import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShortLinkComponent } from '../../short-link.component';

@Component({
  selector: 'app-post-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrl: './hello-world.component.scss',
  standalone: true,
  imports: [ShortLinkComponent, RouterLink],
})
export class HelloWorldPostComponent {}
