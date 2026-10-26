import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-marrow',
  templateUrl: './marrow.component.html',
  styleUrl: './marrow.component.scss',
  standalone: true,
  imports: [RouterLink],
})
export class MarrowPostComponent {}
