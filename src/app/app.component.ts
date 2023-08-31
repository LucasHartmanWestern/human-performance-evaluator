import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hpe-frontend';

  constructor() { }

  formData: any = localStorage.getItem('userInfo');
  formSubmission: any;

  ngOnInit(): void {
  }

  formSubmit(): void {
    this.formData = localStorage.getItem('userInfo');
  }
}
