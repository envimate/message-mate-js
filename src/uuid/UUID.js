import uuid from "uuid/v4";

export default class Uuid {

    static generateNew() {
        return uuid();
    }
}