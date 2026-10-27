import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-marrow',
  templateUrl: './marrow.component.html',
  styleUrl: './marrow.component.scss',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
})
export class MarrowPostComponent {}
