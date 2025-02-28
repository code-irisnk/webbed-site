import { Component } from '@angular/core';

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  commitSha = 'abc123'; // TODO: this used to use handlebars which filled it with the hash at compile time so fix me by reading https://git.elrant.team/irisnk/webbed-site/raw/branch/main/deploy.js
}
