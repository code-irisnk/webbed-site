import { Component, inject, ViewContainerRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLOG_POST_LOADERS } from '../blog-registry';

@Component({
  selector: 'app-blog-post-shell',
  imports: [],
  template: ` <ng-container #postHost /> `,
})
export class BlogPostShellComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private vcr = inject(ViewContainerRef);

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const loader = BLOG_POST_LOADERS[slug];
    if (!loader) return;
    const component = (await loader()) as never;
    this.vcr.createComponent(component);
  }
}
