import { ImageLoaderConfig } from '@angular/common';

export const profileImageLoader = ({ src, width }: ImageLoaderConfig) => {
  const mapping: Record<number, string> = {
    50: 'index/pfp-50.webp',
    100: 'index/pfp-100.webp',
    200: 'index/pfp-200.webp',
    2048: 'index/pfp.webp',
  };
  return mapping[width || 50] || src.replace('.png', '.webp');
};
