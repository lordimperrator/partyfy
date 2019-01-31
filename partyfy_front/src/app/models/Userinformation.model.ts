import {Deserializable} from './Deserializable.model';



export class UserInformation implements Deserializable {
    username: string;
    devices: Array<String>;
    constructor() {}

    deserialize(input: any) {
        this.devices = new Array<String>();
        console.log('.');
        this.username = input.username;
        input.devices.forEach(element => {
            this.devices.push(element);
        });
        return this;
    }
}
