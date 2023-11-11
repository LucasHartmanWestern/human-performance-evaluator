import { Component, Input } from '@angular/core';
import { GameEndpointsService } from "../services/game-endpoints.service";
import { NgxSpinnerService } from "ngx-spinner";
import { GameEntry } from "../constants/common.enum"

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

  imgHeight = 400;
  imgWidth = 400;

  timer: any;

  started: boolean = false;
  running: boolean = false;
  ended: boolean = false;

  extra: any = {
    'num_shapes': '',
    'conjunction': '',
    'target_color': '',
    'target_shape': ''
  };

  // Get users data
  ngOnInit(): void {
    if (localStorage.getItem('userID'))
      this.getNextImage(false);

    document.addEventListener('keydown', function(event) {
      if (document.querySelector('.present_buttons') != null) {
        if (event.key === 'ArrowLeft') {
          (document.querySelector('.present') as HTMLElement).click();
        }
        else if (event.key === 'ArrowRight') {
          (document.querySelector('.absent') as HTMLElement).click();
        }
      }

      if (document.querySelector('#pause') != null) {
        if (event.key === ' ' || event.key === 'Spacebar') {
          (document.querySelector('#pause') as HTMLElement).click();
        }
      }
    });
  }

  pause(): void {
    if (this.running) {
      clearInterval(this.timer);
      this.running = false;
      this.startCounter(30, true);
    }
  }

  showItem(): void {
    this.numOfErrors = 0;

    const startTime = performance.now() - this.elapsedTime;

    this.timer = setInterval(() => {
      const now = performance.now();
      this.elapsedTime = now - startTime;
    }, 1);

    let windowContainer = document.getElementById('window');
    let img = document.querySelector('img');

    let button = document.getElementById('foundButton');

    button?.setAttribute('style', `width: calc(${this.image?.width} / ${this.imgWidth} * 100%); height: calc(${this.image?.height} / ${this.imgHeight} * 100%); top: calc((${this.image?.posY} - (${this.image?.height} / 2)) / ${this.imgHeight} * 100%); left: calc((${this.image?.posX} - (${this.image?.width} / 2)) / ${this.imgWidth} * 100%);`);

    windowContainer?.querySelector('#game_image')?.setAttribute('style', 'max-width: 100%;');
  }

  getPos(event: any): void {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();

    const x = event.clientX - rect.left; // x position within the image
    const y = event.clientY - rect.top; // y position within the image

    const xPercentage = (x / rect.width);
    const yPercentage = (y / rect.height);

    const xCoord = xPercentage * this.imgWidth;
    const yCoord = yPercentage * this.imgWidth;

    const xOffset = Math.abs(xCoord - (this.image?.posX || 0));
    const yOffset = Math.abs(yCoord - (this.image?.posY || 0));

    const distOffset = (((xCoord - (this.image?.posX || 0)) ** 2) + ((yCoord - (this.image?.posY || 0)) ** 2)) ** 0.5

    this.found(event, undefined, distOffset, xCoord, yCoord, xOffset, yOffset, this.image?.posX, this.image?.posY);
  }

  found(event: any, present?: boolean, distOffset?: number, xCoord?: number, yCoord?: number, xOffset?: number, yOffset?: number, targetPostX?: number, targetPosY?: number): void {

    if (present != undefined) {
      if (!this.image?.find_pos) {
        if (this.image?.present != present) {
          this.numOfErrors += 1;
        }
      }
    }
    else {
      event?.target?.setAttribute('class', 'found');
    }

    if (this.imageCounter == this.maxNumOfTargets) {
      this.end(true);
      return;
    }

    clearInterval(this.timer);
    document.getElementById('game_text_display')?.removeAttribute('class');

    this.totalDuration += this.elapsedTime;
    this.totalMistakes += this.numOfErrors;

    this.getNextImage(true, distOffset, xCoord, yCoord, present, xOffset, yOffset, targetPostX, targetPosY);
  }

  getNextImage(count: boolean, distOffset?: number, xCoord?: number, yCoord?: number, present?: boolean, xOffset?: number, yOffset?: number, targetPostX?: number, targetPosY?: number): void {

    console.log('GET NEXT IMAGE');

    let task_type = localStorage.getItem('task_type') || '';

    this.spinner.show();
    this.gameEndpointsService.submitImage(this.elapsedTime, this.numOfErrors, this.imageCounter, task_type, distOffset, xCoord, yCoord, present,  xOffset, yOffset, targetPostX, targetPosY, this.extra).subscribe(res => {
      this.image = {
        file: res.image,
        posX: res.posX,
        posY: res.posY,
        width: res.width,
        height: res.height,
        find_pos: res.find_position
      }

      if (res?.num_shapes != undefined) this.extra['num_shapes'] = res.num_shapes;
      if (res?.conjunction != undefined) this.extra['conjunction'] = res.conjunction;
      if (res?.target_color != undefined) this.extra['target_color'] = res.target_color;
      if (res?.target_shape != undefined) this.extra['target_shape'] = res.target_shape;

      if (res?.target != undefined) this.image['target'] = res.target;
      if (res?.check_errors != undefined) this.image['check_errors'] = res.check_errors;
      if (res?.present != undefined) this.image['present'] = res.present;
      if (res?.max_images != undefined) this.maxNumOfTargets = res.max_images;

      if (count) {
        this.startCounter();
        this.running = false;
      }

      this.spinner.hide();
    }, error => {
      console.log(error);


      this.image = {
        file: "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",
        posX: 0,
        posY: 0,
        width: 0,
        height: 0,
        find_pos: true,
        target: "click \"Y\" for yes or \"N\" for no - if there is a green square",
        present: true,
      }

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
    if (this.image?.find_pos)
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

    this.getNextImage(true);
  }

  startCounter(interval: number = 3, pause: boolean = false): void {
    if (!pause) this.elapsedTime = 0;

    let textElement = document.getElementById('game_text_display');

    if (textElement && this.image?.target) {
      textElement.textContent = `${this.image?.target || ''}`;
    }

    setTimeout(() => {
      textElement?.setAttribute('class', 'counting');
      if (textElement) { textElement.textContent = `${interval}` };

      let countdownInterval = setInterval(() => {
        if (textElement?.textContent == '1') {

          textElement.textContent = '';
          textElement?.setAttribute('class', 'hidden');
          clearInterval(countdownInterval);
          this.running = true;

          if (!pause) this.imageCounter += 1;

          setTimeout(() => {
            this.prepareItem();
          }, 10);
        } else {

          if (textElement) {
            textElement.textContent = `${parseInt(textElement.textContent || '0') - 1}`
          }
        }
      }, 750);
    }, this?.image?.target && !pause ? 5000 : 0);
  }
}
