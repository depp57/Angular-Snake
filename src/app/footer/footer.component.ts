import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {AudioService} from '../services/audio.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  footerMessage = 'Inscrivez-vous pour enregistrer votre classement !';
  userSubscription: Subscription;

  constructor(private authService: AuthService,
              private audioService: AudioService) {
    this.userSubscription = authService.userSubject.subscribe(
      (name) => {
        if (name != null) this.footerMessage = 'Hello ' + name + '!';
        else this.footerMessage = 'Inscrivez-vous pour enregistrer votre classement !';
      }
    );
  }

  onMusic() {
    this.audioService.toggleAudio();
  }
}
