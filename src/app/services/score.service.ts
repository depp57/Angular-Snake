import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AuthService} from './auth.service';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import {RankModel} from '../models/rank.model';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  scoreSubject: Subject<RankModel[]> = new Subject<RankModel[]>();

  private userSubscription: Subscription;
  private user: string;

  constructor(authService: AuthService) {
    this.userSubscription = authService.userSubject.subscribe(user => this.user = user);
  }

  saveScore(score: number) {
    if (!this.user) return;

    let id;
    firebase.database().ref('scores').once(
      'value', (data: DataSnapshot) => id = data.exists() ? data.numChildren() : 0
    ).then((data) => {
      if (id < 10) {
        firebase.database().ref(`scores/${id}`).set({
          user: this.user,
          score
        });
      }
      else {
        const ranks = data.val() as RankModel[];

        // Check if someone has a lower score
        if (ranks.some(rank => rank.score < score)) {
          let minScore = {score: ranks.pop().score, index: ranks.length};

          // Get the lowest score, to replace it by the new one
          ranks.forEach((rank, i) => {
            if (rank.score < minScore.score) minScore = {score: rank.score, index: i};
          });

          firebase.database().ref(`scores/${minScore.index}`).set({
            user: this.user,
            score
          });
        }
      }
     // TODO
    });
  }

  getScores() {
    firebase.database().ref('scores')
      .on('value', data => {
        const scores = data.val() ? data.val() : [];
        const ranks = scores.map(score => new RankModel(score.user, score.score));
        ranks.sort((r1, r2) => {
          return r1.score < r2.score ? 1 : -1;
        });
        this.scoreSubject.next(ranks);
      });
  }
}
