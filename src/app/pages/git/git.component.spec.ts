import { TestBed } from '@angular/core/testing';
import { GitComponent } from './git.component';

describe('GitComponent', () => {
  it('has a single page heading and lists the forges', async () => {
    await TestBed.configureTestingModule({ imports: [GitComponent] }).compileComponents();
    const fixture = TestBed.createComponent(GitComponent);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('h1').length).toBe(1);
    expect(page.querySelectorAll('li a').length).toBeGreaterThan(0);
  });
});
