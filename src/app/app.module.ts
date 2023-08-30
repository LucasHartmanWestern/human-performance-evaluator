import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InfoFormComponent } from './info-form/info-form.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoFormComponent,
    GameComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
