import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {AuthGuardService} from './services/auth-guard.service';
import {GameComponent} from './game/game.component';
import {LoginComponent} from './login/login.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuardService]},
  { path: 'game', component: GameComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
