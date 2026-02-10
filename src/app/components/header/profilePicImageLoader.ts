import { ImageLoaderConfig } from '@angular/common';

export const profileImageLoader = ({ src, width }: ImageLoaderConfig) => {
  const mapping: Record<number, string> = {
    50: 'index/pfp-50.png',
    100: 'index/pfp-100.png',
    200: 'index/pfp-200.png',
    2048: 'index/pfp.png',
  };
  return mapping[width || 50] || src;
};
