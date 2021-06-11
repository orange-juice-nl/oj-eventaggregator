declare type SubscriberFunction<Events extends Record<string, unknown>, K extends keyof Events> = (data: Events[K], event: K | "*") => any;
declare type Subscriber<Events extends Record<string, unknown>, K extends keyof Events> = {
    fn: SubscriberFunction<Events, K>;
    off: () => void;
    pause: () => void;
    resume: () => void;
    paused?: boolean;
};
export declare class EventAggregator<Events extends Record<string, unknown>> {
    events: Record<keyof Events, Subscriber<Events, keyof Events>[]>;
    emit<K extends keyof Events>(event: K, data: Events[K]): this;
    on<K extends keyof Events>(event: K, fn: SubscriberFunction<Events, K>): Subscriber<Events, K>;
    once<K extends keyof Events>(event: K, fn: SubscriberFunction<Events, K>): Subscriber<Events, K>;
    off<K extends keyof Events>(event: K, sub: Subscriber<Events, K>): this;
    clear<K extends keyof Events>(event: K): this;
    emitAll<K extends Array<keyof Events>>(events: K, data: Events[K[0]]): this;
    onAll<K extends Array<keyof Events>>(events: K, fn: SubscriberFunction<Events, K[0]>): Subscriber<Events, keyof Events>[];
    onceAll<K extends Array<keyof Events>>(events: K, fn: SubscriberFunction<Events, K[0]>): Subscriber<Events, keyof Events>[];
    clearAll<K extends Array<keyof Events>>(events: K): this;
}
export {};
