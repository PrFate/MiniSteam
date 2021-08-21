import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { GamesListComponent } from './games-list/games-list.component';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'games', component: GamesListComponent},
  {path: 'profile/:id', component: ProfileComponent},
  {path: 'library/:id', component: GamesListComponent},
  {path: 'friends/:id', component: FriendsListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
