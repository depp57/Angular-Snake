import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-leaderboard-item',
  templateUrl: './leaderboard-item.component.html',
  styleUrls: ['./leaderboard-item.component.css']
})
export class LeaderboardItemComponent implements OnInit {

  @Input() rang: number;
  @Input() name: string;
  @Input() score: number;

  constructor() { }

  ngOnInit(): void {
  }

}
