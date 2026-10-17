import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let header: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HeaderComponent);
    await fixture.whenStable();
    header = fixture.nativeElement as HTMLElement;
  });

  it('links the wordmark home without using a heading', () => {
    expect(header.querySelector('a.home-link')?.getAttribute('href')).toBe('/');
    expect(header.querySelector('h1')).toBeNull();
  });

  it('opens the menu with the native popover attributes, no script involved', () => {
    const menu = header.querySelector('nav');
    expect(menu?.hasAttribute('popover')).toBe(true);
    expect(header.querySelector('button.hamburger')?.getAttribute('popovertarget')).toBe(menu?.id);
  });

  it('labels the navigation landmark', () => {
    expect(header.querySelector('nav')?.getAttribute('aria-label')).toBe('Main');
  });
});
