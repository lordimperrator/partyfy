import { Deserializable } from './Deserializable.model';

export class Playlist implements Deserializable {
    playlistname: string;
    playlistid: string;

    constructor() {}

    deserialize(input: any) {
        this.playlistname = input.playlistName;
        this.playlistid = input.playlistId;
        return this;
    }
}
