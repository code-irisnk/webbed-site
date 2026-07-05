import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BlogPostMeta } from '../pages/blog/blog-registry';

@Injectable({ providedIn: 'root' })
export class OgService {
  private meta = inject(Meta);
  private title = inject(Title);

  setPostMeta(post: BlogPostMeta): void {
    const title = `${post.title} - a post by Iris`;
    const image = post.ogImage ?? 'https://irisnk.me/index/pfp.png';
    const url = `https://irisnk.me/blog/${post.slug}`;

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: post.description });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: post.description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Iris Nkrichronos' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: post.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }
}
