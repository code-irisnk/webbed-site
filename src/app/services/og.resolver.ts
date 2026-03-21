import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogPostMeta } from '../pages/blog/blog-registry';
import { OgService } from './og.service';

export const ogResolver =
  (post: BlogPostMeta): ResolveFn<void> =>
  () =>
    inject(OgService).setPostMeta(post);
