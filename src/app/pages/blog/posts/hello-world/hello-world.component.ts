import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrl: './hello-world.component.scss',
  standalone: true,
  imports: [RouterLink],
})
export class HelloWorldPostComponent {}
