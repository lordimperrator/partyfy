import { Component, OnInit } from '@angular/core';
import { Playlist } from '../models/Playlist.model';
import { FormService } from '../form.service';

@Component({
  selector: 'app-signin-playlist-form',
  templateUrl: './signin-playlist-form.component.html',
  styleUrls: ['./signin-playlist-form.component.scss']
})
export class SigninPlaylistFormComponent implements OnInit {
  playlists = new Array<Playlist>();
  selectedPlaylist: String;
  constructor(private formService: FormService) {
    this.formService.userinfo$.subscribe(
      (data) => {
        console.log(data);
        this.playlists = data.playlists;
      }
    );
    if (formService.getPlaylistId() != null) {
      this.selectedPlaylist = formService.getPlaylistId();
    } else {
      this.selectedPlaylist = this.playlists[0].playlistid;
    }
    formService.setPlaylistId(this.selectedPlaylist);
    console.log(this.selectedPlaylist);
  }

  ngOnInit() {}

  previousPage() {
    this.formService.toPage(1);
  }

  nextPage() {
    this.formService.toPage(3);
  }

  setplaylistId(input: String) {
    this.formService.setPlaylistId(input);
  }

}
