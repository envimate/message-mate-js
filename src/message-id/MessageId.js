import Uuid from "../uuid/UUID";

export default class MessageId {

    static generateNew() {
        return Uuid.generateNew();
    }
}