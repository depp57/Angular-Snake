import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SigninComponent} from './signin/signin.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {AuthGuardService} from './services/auth-guard.service';
import {GameComponent} from './game/game.component';


const routes: Routes = [
  { path: '', component: SigninComponent},
  { path: 'scoreboard', component: ScoreboardComponent, canActivate: [AuthGuardService]},
  { path: 'game', component: GameComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
