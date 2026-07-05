import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-bully',
  templateUrl: './bully.component.html',
  styleUrl: './bully.component.scss',
  standalone: true,
  imports: [RouterLink],
})
export class BullyPostComponent {}
