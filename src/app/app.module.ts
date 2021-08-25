import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { FriendItemComponent } from './friends-list/friend-item/friend-item.component';
import { FriendsSearchComponent } from './friends-list/friends-search/friends-search.component';
import { GamesListComponent } from './games/games-list/games-list.component';
import { GameItemComponent } from './games/games-list/game-item/game-item.component';
import { GameSearchComponent } from './games/game-search/game-search.component';
import { FiltersComponent } from './games/filters/filters.component';
import { GameDetailsComponent } from './games/game-details/game-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GamesComponent } from './games/games.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ProfileComponent,
    FriendsListComponent,
    FriendItemComponent,
    FriendsSearchComponent,
    GamesListComponent,
    GameItemComponent,
    GameSearchComponent,
    FiltersComponent,
    GameDetailsComponent,
    GamesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
