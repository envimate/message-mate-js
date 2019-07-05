import {useEffect} from "react";

export default function useSubscription(messageBus, type, handler) {
    useEffect(() => {
        const subscriptionId = messageBus.subscribe(type, handler);
        return () => {
            return messageBus.unsubscribe(subscriptionId);
        };

    }, []);
}