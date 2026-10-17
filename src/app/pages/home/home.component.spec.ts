import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('has a single, visually hidden page heading', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();

    const headings = (fixture.nativeElement as HTMLElement).querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(headings[0].classList).toContain('sr-only');
  });
});
