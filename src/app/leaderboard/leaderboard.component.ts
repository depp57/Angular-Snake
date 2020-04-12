import {Component, OnDestroy, OnInit} from '@angular/core';
import {RankModel} from '../models/rank.model';
import {ScoreService} from '../services/score.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  ranks: RankModel[];
  private leaderBoardSubscription: Subscription;

  constructor(private scoreService: ScoreService) { }

  ngOnInit(): void {
    this.leaderBoardSubscription = this.scoreService.scoreSubject.subscribe(
      ranks => this.ranks = ranks
    );
    this.scoreService.getScores();
  }

  ngOnDestroy(): void {
    this.leaderBoardSubscription.unsubscribe();
  }

}
