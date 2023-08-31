import { Component } from '@angular/core';
import { GameEndpointsService } from "../services/game-endpoints.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  constructor(private gameEndpointsService: GameEndpointsService) { }

  image: { file: string, posX: string, posY: string, width: string, height: string } | undefined;

  // Get users data
  ngOnInit(): void {
    this.gameEndpointsService.getFirstImage().subscribe(res => {
      this.image = res;
    }, error => {
      this.image = {
        file: '',
        posX: '',
        posY: '',
        width: '',
        height: ''
      }
    });
  }
}
