import SubscriptionId from "./subscription/SubscriptionId";
import MessageId from "./message-id/MessageId";

export default class MessageBus {
    _typeBasedSubscriptionMap;
    _correlationIdBasedSubscriptionMap;
    _subscriptionIdLookUpMap;
    _filters;

    constructor() {
        this._typeBasedSubscriptionMap = new Map();
        this._correlationIdBasedSubscriptionMap = new Map();
        this._subscriptionIdLookUpMap = new Map();
        this._filters = [];
    }

    send(type, payload, messageId, correlationId) {
        messageId = messageId ? messageId : MessageId.generateNew();
        const message = {
            type: type,
            payload: payload,
            messageId: messageId,
            correlationId: correlationId
        };

        let nextMessage = message;
        for (const filter of this._filters) {
            nextMessage = filter(nextMessage);
            if (nextMessage === undefined || nextMessage === null) {
                return;
            }
        }


        const typeSubscriptions = this._typeBasedSubscriptionMap.get(type) || [];
        const correlationIdSubscriptions = this._correlationIdBasedSubscriptionMap.get(correlationId) || [];
        const receivers = [...typeSubscriptions, ...correlationIdSubscriptions];
        for (const receiver of receivers) {
            receiver.handlerFunc(payload, message);
        }

    }

    subscribe(type, handlerFunc) {
        const subscription = Subscription.subscriptionForType(type, handlerFunc);
        const subscriptionList = this._typeBasedSubscriptionMap.get(type);
        if (subscriptionList) {
            subscriptionList.push(subscription);
        } else {
            const newSubscriptionList = [subscription];
            this._typeBasedSubscriptionMap.set(type, newSubscriptionList);
        }
        const subscriptionId = subscription.subscriptionId;
        this._subscriptionIdLookUpMap.set(subscriptionId, subscription);
        return subscriptionId;
    }

    subscribeForCorrelationId(correlationId, handlerFunc) {
        const subscription = Subscription.subscriptionForCorrelationId(correlationId, handlerFunc);
        const subscriptionList = this._correlationIdBasedSubscriptionMap.get(correlationId);
        if (subscriptionList) {
            subscriptionList.push(subscription);
        } else {
            const newSubscriptionList = [subscription];
            this._correlationIdBasedSubscriptionMap.set(correlationId, newSubscriptionList);
        }
        const subscriptionId = subscription.subscriptionId;
        this._subscriptionIdLookUpMap.set(subscriptionId, subscription);
        return subscriptionId;
    }

    unsubscribe(subscriptionId) {
        const subscription = this._subscriptionIdLookUpMap.get(subscriptionId);
        if (subscription) {
            const type = subscription.type;
            if (type) {
                const subscriptionList = this._typeBasedSubscriptionMap.get(type);
                subscriptionList.filter(e => e !== subscription);
            }
            const correlationId = subscription.correlationId;
            if (correlationId) {
                const subscriptionList = this._correlationIdBasedSubscriptionMap.get(correlationId);
                subscriptionList.filter(e => e !== subscription);
            }
        }
    }

    addFilter(filter) {
        this._filters.push(filter);
    }

}


class Subscription {
    constructor(subscriptionId, type, correlationId, handlerFunc) {
        this._subscriptionId = subscriptionId;
        this._type = type;
        this._correlationId = correlationId;
        this._handlerFunc = handlerFunc;
    }

    _subscriptionId;

    get subscriptionId() {
        return this._subscriptionId;
    }

    _type;

    get type() {
        return this._type;
    }

    _correlationId;

    get correlationId() {
        return this._correlationId;
    }

    _handlerFunc;

    get handlerFunc() {
        return this._handlerFunc;
    }

    static subscriptionForType(type, handlerFunc) {
        const subscriptionId = SubscriptionId.generateNew();
        return new Subscription(subscriptionId, type, null, handlerFunc);
    }

    static subscriptionForCorrelationId(correlationId, handlerFunc) {
        const subscriptionId = SubscriptionId.generateNew();
        return new Subscription(subscriptionId, null, correlationId, handlerFunc);
    }
}