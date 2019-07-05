export default class CorrelationId {
    _relatedMessageId;

    constructor(relatedMessageId) {
        this._relatedMessageId = relatedMessageId;
    }

    static generateNew(messageID) {
        return new CorrelationId(messageID);
    }

    relatesTo(otherMessageId) {
        return this._relatedMessageId === otherMessageId;
    }
}