import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { GameDetailsComponent } from './games/game-details/game-details.component';
import { GamesListComponent } from './games/games-list/games-list.component';
import { GamesComponent } from './games/games.component';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'games', component: GamesComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'library/:id', component: GamesComponent},
  {path: 'friends/:id', component: FriendsListComponent},
  {path: 'games/:id', component: GameDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
