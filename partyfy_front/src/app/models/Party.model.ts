
export class Party {
    private name: String;
    private userid: String;
    private deviceid: String;
    private playlistid: String;

    constructor() {}

    public getName(): String {
        return this.name;
    }

    public getUserId(): String {
        return this.userid;
    }

    public getDeviceId(): String {
        return this.deviceid;
    }

    public getPlaylistId(): String {
        return this.playlistid;
    }

    public setName(name: String) {
        this.name = name;
    }

    public setUserId(userid: String) {
        this.userid = userid;
    }

    public setDeviceId(deviceid: String) {
        this.deviceid = deviceid;
    }

    public setPlaylistId(playlistid: String) {
        this.playlistid = playlistid;
    }

    public toJsonObject(): string {
        return `{"partyname" : "` + this.name + `",
                        "userid" : "` + this.userid + `",
                        "deviceid" : "` + this.deviceid + `",
                        "playlistid" : "` + this.playlistid + `"}`;

    }
}
