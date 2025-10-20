import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-header-component',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [RouterLink, NgOptimizedImage],
    standalone: true,
})
export class HeaderComponent implements OnInit {
    private router = inject(Router);

    currentRoute = '';

    ngOnInit() {
        // Subscribe to router events to get the current route
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                // Extract the base route without parameters
                this.currentRoute = event.urlAfterRedirects.split('/')[1] || '';
            });
    }

    isCurrentRoute(route: string): boolean {
        // Convert an empty route 'home' for comparison
        const normalizedRoute = route === '' ? 'home' : route;
        const normalizedCurrentRoute = this.currentRoute === '' ? 'home' : this.currentRoute;
        return normalizedRoute === normalizedCurrentRoute;
    }
}
