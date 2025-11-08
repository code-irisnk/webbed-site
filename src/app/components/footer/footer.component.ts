import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-footer-component',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    commitSha: string = environment.commitSha;
    commitShaFull: string = environment.commitShaFull;
}
