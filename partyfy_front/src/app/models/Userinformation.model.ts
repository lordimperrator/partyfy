import {Deserializable} from './Deserializable.model';



export class UserInformation implements Deserializable {
    username: string;

    constructor() {}

    deserialize(input: any) {
        this.username = input.username;
        return this;
    }
}
