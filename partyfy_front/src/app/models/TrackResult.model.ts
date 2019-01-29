import {Deserializable} from './Deserializable.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';


export class TrackResult implements Deserializable {
    name: string;
    artist: string;
    imageUrl: SafeUrl;

    constructor(private sanitizer: DomSanitizer) {}

    deserialize(input: any) {
        this.name = input.name;
        this.artist = input.artists[0].name;
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(input.album.images[0].url);
        return this;
    }
}
