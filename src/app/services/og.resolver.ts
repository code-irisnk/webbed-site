import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BlogPostMeta } from '../pages/blog/blog-registry';
import { OgService } from './og.service';

export const ogResolver =
  (post: BlogPostMeta): ResolveFn<void> =>
  () => {
    if (isPlatformServer(inject(PLATFORM_ID))) inject(OgService).setPostMeta(post);
  };
