import {Deserializable} from './Deserializable.model';
import { Device } from './Device.model';
import { Playlist } from './Playlist.model';



export class UserInformation implements Deserializable {
    username: string;
    devices: Array<Device>;
    playlists: Array<Playlist>;
    constructor() {}

    deserialize(input: any) {
        this.devices = new Array<Device>();
        this.playlists = new Array<Playlist>();
        this.username = input.username;
        input.devices.forEach(element => {
            this.devices.push(new Device().deserialize(element));
        });
        input.playlists.forEach(element => {
            this.playlists.push(new Playlist().deserialize(element));
        });
        return this;
    }
}
