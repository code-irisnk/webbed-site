import { TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('links to the commit it was built from', async () => {
    await TestBed.configureTestingModule({ imports: [FooterComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FooterComponent);
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a.shasum');
    expect(link?.getAttribute('href')).toContain('git.elrant.team/irisnk/webbed-site/commit/');
  });
});
