import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JsonLd } from './structured-data';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_URL = 'https://irisnk.me';
const DEFAULT_TITLE = 'Iris Nkrichronos';

@Injectable({ providedIn: 'root' })
export class SiteTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly isServer = isPlatformServer(inject(PLATFORM_ID));

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? DEFAULT_TITLE;
    this.title.setTitle(title);

    // Everything below only matters to crawlers, which read the prerendered HTML; the browser needs just the title.
    if (!this.isServer) return;

    this.meta.updateTag({ property: 'og:title', content: title });

    const data = this.deepestData(snapshot);
    this.setJsonLd((data['jsonLd'] as JsonLd | undefined) ?? null);

    if (data['noindex']) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
      this.setCanonical(null);
      return;
    }

    const url = this.canonicalUrl(snapshot.url);
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.setCanonical(url);
  }

  // (Cloudflare Pages serves directories with a trailing slash).
  private canonicalUrl(url: string): string {
    const path = url.split(/[?#]/)[0].replace(/\/+$/, '');
    return `${SITE_URL}${path}/`;
  }

  private deepestData(snapshot: RouterStateSnapshot): Record<string, unknown> {
    let route: ActivatedRouteSnapshot = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route.data;
  }

  private setJsonLd(data: JsonLd | null): void {
    let script = this.document.getElementById('page-jsonld');

    if (!data) {
      script?.remove();
      return;
    }

    if (!script) {
      script = this.document.createElement('script');
      script.id = 'page-jsonld';
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private setCanonical(url: string | null): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!url) {
      link?.remove();
      return;
    }

    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      head.appendChild(link);
    }
    link.href = url;
  }
}
