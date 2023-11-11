import { Component, EventEmitter, ViewChild } from '@angular/core';
import { GameComponent } from "./game/game.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hpe-frontend';

  @ViewChild(GameComponent) gameComponent!: GameComponent;

  constructor() { }

  userID: any = localStorage.getItem('userID');
  formSubmission: any;

  ngOnInit(): void {
    if (localStorage.getItem('displayMode') == 'dark') {
      document.querySelector('body')?.setAttribute('class', 'dark');
      document.getElementById('darkmode-toggle')?.setAttribute('checked', 'true');
    }
  }

  formSubmit(): void {
    this.userID = localStorage.getItem('userID');
    console.log('FORM SUBMITTED');
    this.gameComponent.getNextImage(false);
  }

  toggleMode(): void {
    let body = document.querySelector('body');

    let mode = localStorage.getItem('displayMode');
    if (!mode) {
      let bodyClass = body?.getAttribute('class');
      mode = bodyClass || 'light';
      mode = mode == 'dark' ? 'light' : 'dark'
      localStorage.setItem('displayMode', mode);
    } else {
      mode = mode == 'dark' ? 'light' : 'dark'
      localStorage.setItem('displayMode', mode);
    }

    body?.setAttribute('class', mode);
  }
}
