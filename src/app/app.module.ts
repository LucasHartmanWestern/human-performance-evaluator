import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InfoFormComponent } from './info-form/info-form.component';
import { GameComponent } from './game/game.component';
import { HttpClientModule } from "@angular/common/http";
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbActiveModal, NgbModal, NgbModule, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MsToTimePipe } from './pipes/ms-to-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    InfoFormComponent,
    GameComponent,
    MsToTimePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
