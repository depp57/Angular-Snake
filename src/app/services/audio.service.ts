import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private currentAudio: HTMLAudioElement;

  constructor() { }

  playAudio(name: string) {
    this.currentAudio = new Audio('assets/' + name);
    this.currentAudio.volume = 0.15;
    this.currentAudio.loop = true;
  }

  toggleAudio() {
    if (this.currentAudio.paused) this.currentAudio.play();
    else this.currentAudio.pause();
  }

  changeVolume(volume: number) {
    if (volume >= 0 && volume <= 1) this.currentAudio.volume = volume;
  }
}
