export declare type SubscriberFunction<Events extends Record<string, unknown>, K extends keyof Events> = (data: Events[K], event: K) => any;
export declare type Subscriber<Events extends Record<string, unknown> = any, K extends keyof Events = any> = {
    fn: SubscriberFunction<Events, K>;
    off: () => void;
    pause: () => void;
    resume: () => void;
    paused?: boolean;
};
export declare class EventAggregator<Events extends Record<string, unknown>> {
    events: Record<keyof Events, Subscriber<Events, keyof Events>[]>;
    paused: boolean;
    emit<K extends keyof Events>(event: K, data: Events[K]): this;
    on<K extends keyof Events>(event: K | "*", fn: SubscriberFunction<Events, K>): Subscriber<Events, K>;
    once<K extends keyof Events>(event: K | "*", fn: SubscriberFunction<Events, K>): Subscriber<Events, K>;
    off<K extends keyof Events>(event: K | "*", sub: Subscriber<Events, K>): this;
    clear<K extends keyof Events>(event: K | "*"): this;
    emitMultiple<K extends Array<keyof Events>>(events: K, data: Events[K[0]]): this;
    onMultiple<K extends Array<keyof Events>>(events: K, fn: SubscriberFunction<Events, K[0]>): Subscriber<Events, keyof Events>[];
    onceMultiple<K extends Array<keyof Events>>(events: K, fn: SubscriberFunction<Events, K[0]>): Subscriber<Events, keyof Events>[];
    clearMultiple<K extends Array<keyof Events>>(events: K): this;
    pause(): this;
    resume(): this;
}
