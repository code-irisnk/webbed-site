import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS, BlogPostMeta } from './blog-registry';
import { MatIcon } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, MatIcon],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIcon('my-rss', sanitizer.bypassSecurityTrustResourceUrl('icons/rss.svg'));
    iconRegistry.addSvgIcon('my-atom', sanitizer.bypassSecurityTrustResourceUrl('icons/atom.svg'));
    iconRegistry.addSvgIcon('my-jsonfeed', sanitizer.bypassSecurityTrustResourceUrl('icons/jsonfeed.svg'));
  }
  readonly posts: BlogPostMeta[] = BLOG_POSTS;
}
