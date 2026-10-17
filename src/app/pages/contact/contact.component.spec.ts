import { TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  it('has a single page heading and mailto links', async () => {
    await TestBed.configureTestingModule({ imports: [ContactComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ContactComponent);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('h1').length).toBe(1);
    expect(page.querySelectorAll('a[href^="mailto:"]').length).toBeGreaterThan(0);
  });
});
