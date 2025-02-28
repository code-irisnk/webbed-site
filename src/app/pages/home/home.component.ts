import { Component } from '@angular/core';
import {EightyEightComponent} from '../../components/eighty-eight/eighty-eight.component';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  imports: [
    EightyEightComponent
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent { }
