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

  timer: any;

  started: boolean = false;
  running: boolean = false;

  // Get users data
  ngOnInit(): void {
    this.spinner.show();
    this.gameEndpointsService.getFirstImage().subscribe(res => {
      this.image = res;
      this.spinner.hide();
    }, error => {
      this.image = {
        file: 'test_1.png',
        posX: 155,
        posY: 203,
        width: 28,
        height: 28,
        target: 'Red Square'
      }
      this.spinner.hide();
    });
  }

  showItem(): void {

    const startTime = performance.now();

    this.timer = setInterval(() => {
      const now = performance.now();
      this.elapsedTime = now - startTime;
    }, 10);

    let windowContainer = document.getElementById('window');
    let img = document.querySelector('img');
    windowContainer?.setAttribute('style', `height: ${img?.offsetHeight}px; width: ${img?.offsetWidth}px;`);

    let button = document.getElementById('foundButton');
    button?.setAttribute('style', `width: ${this.image?.width}px; height: ${this.image?.height}px; top: ${this.image?.posY}px; left: ${this.image?.posX}px; max-height: 100%; max-width: 100%;`);

  }

  found(event: any): void {
    event?.target?.setAttribute('class', 'found');

    clearInterval(this.timer);
    document.getElementById('game_text_display')?.removeAttribute('class');

    this.spinner.show();
    this.gameEndpointsService.submitImage(this.elapsedTime, this.numOfErrors).subscribe(res => {
      this.image = res;
      this.startCounter();
      this.running = false;
      this.spinner.hide();
    }, error => {
      if (this.image?.file == 'test_2.png')
        this.image = {
          file: 'test_1.png',
          posX: 155,
          posY: 203,
          width: 28,
          height: 28,
          target: 'Red Square'
        }
      else
        this.image = {
          file: 'test_2.png',
          posX: 46,
          posY: 116,
          width: 24,
          height: 24,
          target: 'Red Cross'
        }

      this.startCounter();
      this.running = false;
      this.spinner.hide();
    });
  }

  prepareItem(): void {
    let image = document.getElementById('game_image');
    image?.setAttribute('src', `assets/images/test-images/${this.image?.file}`);
    console.log(image);

    setTimeout(() => {
      this.showItem();
    }, 10);
  }

  mistake(): void {
    this.numOfErrors += 1;
  }

  begin(): void {
    this.started = true;
    this.startCounter();
  }

  end(): void {
    this.started = false;
    clearInterval(this.timer);
  }

  startCounter(): void {
    let textElement = document.getElementById('game_text_display');

    if (textElement) {
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
    }, 5000);
  }
}
