import { Component, Input } from '@angular/core';
import { GameEndpointsService } from "../services/game-endpoints.service";
import { NgxSpinnerService } from "ngx-spinner";
import { GameEntry } from "../constants/common.enum"
import { Observable } from "rxjs";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  @Input() ready: boolean = false;

  constructor(private gameEndpointsService: GameEndpointsService, private spinner: NgxSpinnerService) { }

  image: GameEntry | undefined;

  imageCounter: number = 0;
  elapsedTime: number = 0;
  numOfErrors: number = 0;

  maxNumOfTargets: number = 20;

  timer: any;

  started: boolean = false;
  running: boolean = false;
  ended: boolean = false;

  // Get users data
  ngOnInit(): void {
    this.spinner.show();
    this.gameEndpointsService.getFirstImage().subscribe(res => {
      this.image = {
        file: res.image,
        posX: res.posX,
        posY: res.posY,
        width: res.width,
        height: res.height,
        target: 'Red Square'
      }
      this.spinner.hide();
    }, error => {
      let returnObj = {
        "height": 30.0,
        "image": "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",
        "posX": 75.0,
        "posY": 275.0,
        "width": 30.0
      }

      this.image = {
        file: returnObj.image,
        posX: returnObj.posX,
        posY: returnObj.posY,
        width: returnObj.width,
        height: returnObj.height,
        target: 'Red Square'
      }
      this.spinner.hide();
    });
  }

  showItem(): void {
    this.numOfErrors = 0;

    const startTime = performance.now();

    this.timer = setInterval(() => {
      const now = performance.now();
      this.elapsedTime = now - startTime;
    }, 10);

    let windowContainer = document.getElementById('window');
    let img = document.querySelector('img');

    let button = document.getElementById('foundButton');

    let imgHeight = 400;
    let imgWidth = 400;

    button?.setAttribute('style', `width: calc(${this.image?.width} / ${imgWidth} * 100%); height: calc(${this.image?.height} / ${imgHeight} * 100%); top: calc((${this.image?.posY} - (${this.image?.height} / 2)) / ${imgHeight} * 100%); left: calc((${this.image?.posX} - (${this.image?.width} / 2)) / ${imgWidth} * 100%);`);

    windowContainer?.querySelector('#game_image')?.setAttribute('style', 'max-width: 100%;');
  }

  found(event: any): void {
    event?.target?.setAttribute('class', 'found');

    if (this.imageCounter == this.maxNumOfTargets) {
      this.end(true);
      return;
    }

    clearInterval(this.timer);
    document.getElementById('game_text_display')?.removeAttribute('class');

    this.spinner.show();
    this.gameEndpointsService.submitImage(this.elapsedTime, this.numOfErrors, this.imageCounter).subscribe(res => {
      this.image = {
        file: res.image,
        posX: res.posX,
        posY: res.posY,
        width: res.width,
        height: res.height
      }
      if (res?.target) this.image['target'] = res.target;

      this.startCounter();
      this.running = false;
      this.spinner.hide();
    }, error => {
      let returnObj = {
        "height": 30.0,
        "image": "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",
        "posX": 75.0,
        "posY": 275.0,
        "width": 30.0
      }
      this.image = {
        file: returnObj.image,
        posX: returnObj.posX,
        posY: returnObj.posY,
        width: returnObj.width,
        height: returnObj.height,
      }

      this.startCounter();
      this.running = false;
      this.spinner.hide();
    });
  }

  prepareItem(): void {
    let image = document.getElementById('game_image');
    image?.setAttribute('src', `data:image/png;base64,${this.image?.file}`);

    setTimeout(() => {
      this.showItem();
    }, 50);
  }

  mistake(): void {
    this.numOfErrors += 1;
  }

  begin(): void {
    this.started = true;
    this.startCounter();
  }

  end(completed?: boolean): void {
    let textElement = document.getElementById('game_text_display');
    if (textElement) {
      textElement.textContent = completed ? 'Thank you for participating!' : `Completed ${this.imageCounter - 1} tests`;
    }
    textElement?.removeAttribute('class');

    this.elapsedTime = 0;
    this.running = false;
    this.started = false;
    this.ended = true;
    clearInterval(this.timer);
  }

  restart(): void {
    this.ended = false;
    this.started = true;
    this.imageCounter = 0;
    this.startCounter();
  }

  startCounter(): void {
    let textElement = document.getElementById('game_text_display');

    if (textElement && this.image?.target) {
      textElement.textContent = `Find the ${this.image?.target || ''}`;
    }

    setTimeout(() => {
      textElement?.setAttribute('class', 'counting');
      if (textElement) { textElement.textContent = '3' };

      let countdownInterval = setInterval(() => {
        if (textElement?.textContent == '1') {

          textElement.textContent = '';
          textElement?.setAttribute('class', 'hidden');
          clearInterval(countdownInterval);
          this.running = true;
          this.imageCounter += 1;

          setTimeout(() => {
            this.prepareItem();
          }, 10);

        } else {

          if (textElement) {
            textElement.textContent = `${parseInt(textElement.textContent || '0') - 1}`
          }

        }
      }, 1000);
    }, this?.image?.target ? 5000 : 0);
  }
}
