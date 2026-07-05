import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-the-end-poem',
  templateUrl: './the-end-poem.component.html',
  styleUrl: './the-end-poem.component.scss',
  standalone: true,
  imports: [RouterLink],
})
export class TheEndPoemPostComponent {}
