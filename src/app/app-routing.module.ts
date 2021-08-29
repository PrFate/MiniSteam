import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { GameDetailsComponent } from './games/game-details/game-details.component';
// import { GamesListComponent } from './games/games-list/games-list.component';
import { GamesComponent } from './games/games.component';
import { LoginGuard } from './guards/login.guard';
import { LogoutGuard } from './guards/logout.guard';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent,
    canActivate: [LogoutGuard]
  },
  {
    path: 'games', component: GamesComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'library/:id', component: GamesComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'friends/:id', component: FriendsListComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'games/:id', component: GameDetailsComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
