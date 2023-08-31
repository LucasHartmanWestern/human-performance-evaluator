import { Component } from '@angular/core';
import { GameEndpointsService } from "../services/game-endpoints.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  constructor(private gameEndpointsService: GameEndpointsService) { }

  image: { file: string, posX: number, posY: number, width: number, height: number } | undefined;

  // Get users data
  ngOnInit(): void {
    this.gameEndpointsService.getFirstImage().subscribe(res => {
      this.image = res;
      this.moveButton();
    }, error => {
      this.image = {
        file: '',
        posX: 155,
        posY: 202,
        width: 24,
        height: 24
      }
      this.moveButton();
    });
  }

  moveButton(): void {
    let windowContainer = document.getElementById('window');
    let img = document.querySelector('img');
    windowContainer?.setAttribute('style', `height: ${img?.offsetHeight}px; width: ${img?.offsetWidth}px;`);

    let button = document.getElementById('foundButton');
    button?.setAttribute('style', `width: ${this.image?.width}px; height: ${this.image?.height}px; top: ${this.image?.posY}px; left: ${this.image?.posX}px;`)
  }

  found(): void {
    console.log('FOUND');
  }

  mistake(): void {
    console.log('MISTAKE');
  }

  begin(): void {
    console.log('BEGIN');
  }

  end(): void {
    console.log('END');
  }
}
