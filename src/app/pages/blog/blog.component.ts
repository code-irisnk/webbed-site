import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS, BlogPostMeta } from './blog-registry';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, DatePipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  readonly posts: BlogPostMeta[] = BLOG_POSTS;
}
