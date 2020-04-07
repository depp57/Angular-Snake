import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {AudioService} from '../services/audio.service';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  footerMessage = 'Inscrivez-vous pour enregistrer votre classement !';
  userSubscription: Subscription;
  scoreSubscription: Subscription;

  constructor(private authService: AuthService,
              private audioService: AudioService,
              private gameService: GameService) {

    this.userSubscription = authService.userSubject.subscribe(
      (name) => {
        if (name != null) this.footerMessage = 'Hello ' + name + '!';
        else this.footerMessage = 'Inscrivez-vous pour enregistrer votre classement !';
      }
    );

    this.scoreSubscription = gameService.scoreSubject.subscribe(
      score => this.footerMessage = 'Score : ' + score
    );
  }

  onMusic() {
    this.audioService.toggleAudio();
  }
}
