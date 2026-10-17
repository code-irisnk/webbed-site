import { TestBed } from '@angular/core/testing';
import { KeysComponent } from './keys.component';

describe('KeysComponent', () => {
  let page: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [KeysComponent] }).compileComponents();
    const fixture = TestBed.createComponent(KeysComponent);
    await fixture.whenStable();
    page = fixture.nativeElement as HTMLElement;
  });

  it('shows every SSH key as text that selects in one click, without any script', () => {
    const keys = page.querySelectorAll('code.ssh-key');
    expect(keys.length).toBeGreaterThan(0);
    keys.forEach((key) => expect(key.textContent).toMatch(/^(sk-)?ssh-ed25519/));
    expect(page.querySelector('button')).toBeNull();
  });

  it('has a single page heading', () => {
    expect(page.querySelectorAll('h1').length).toBe(1);
  });
});
