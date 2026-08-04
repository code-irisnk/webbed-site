import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { profileImageLoader } from './profilePicImageLoader';

@Component({
  selector: 'app-header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: profileImageLoader,
    },
  ],
  standalone: true,
})
export class HeaderComponent {}
