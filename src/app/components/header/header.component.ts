import { Component, ElementRef, HostBinding, NgZone, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { profileImageLoader } from './profilePicImageLoader';
import { ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, throttleTime, pairwise, map } from 'rxjs';

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
export class HeaderComponent implements AfterViewInit {
  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  @HostBinding('class.shy--hidden') isHidden = false;

  ngAfterViewInit(): void {
    // Only run scroll logic in the browser — safe for SSR
    if (!isPlatformBrowser(this.platformId)) return;

    // Run outside Angular zone for scroll performance
    this.zone.runOutsideAngular(() => {
      let lastScroll = window.scrollY;
      fromEvent(window, 'scroll')
        .pipe(
          map(() => window.scrollY),
          throttleTime(100),
          map((current) => ({
            current,
            direction: current > lastScroll,
          })),
          pairwise(),
          map(([_, curr]) => curr),
        )
        .subscribe(({ current, direction }) => {
          lastScroll = current;
          if (direction !== this.isHidden) {
            this.zone.run((_) => (this.isHidden = direction));
            this.cdr.markForCheck();
          }
        });
    });
  }
}
