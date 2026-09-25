import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-because-the-internet',
  templateUrl: './because-the-internet.component.html',
  styleUrl: './because-the-internet.component.scss',
  standalone: true,
  imports: [RouterLink],
})
export class BecauseTheInternetPostComponent {}
