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

  totalMistakes: number = 0;
  totalDuration: number = 0;

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
        height: res.height
      }
      if (res?.target) this.image['target'] = res.target;
      if (res?.max_images) this.maxNumOfTargets = res.max_images;

      this.spinner.hide();
    }, error => {
      console.log(error);
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

    this.totalDuration += this.elapsedTime;
    this.totalMistakes += this.numOfErrors;

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
      console.log(error);
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
      textElement.textContent = completed ? `Thank you for participating!` : `Completed ${this.imageCounter - 1} tests`;
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
      }, 750);
    }, this?.image?.target ? 5000 : 0);
  }
}
