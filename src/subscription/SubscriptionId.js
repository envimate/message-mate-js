import Uuid from "../uuid/UUID";

export default class SubscriptionId {

    static generateNew() {
        return Uuid.generateNew();
    }
}