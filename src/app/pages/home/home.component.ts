import { Component } from '@angular/core';
import { EightyEightComponent } from '../../components/eighty-eight/eighty-eight.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home-page',
    templateUrl: './home.component.html',
    imports: [EightyEightComponent, RouterLink],
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
