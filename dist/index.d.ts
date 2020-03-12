export declare type Subscriber = (data: any, event: string) => any;
export declare type Middleware = (data: any, event: string) => any | null;
export declare type Subscriptions = {
    [event: string]: Subscriber[];
};
export declare class EventAggregator<Events extends string> {
    private subs;
    private middlewares;
    on(event: Events | "*", fn: Subscriber): () => this;
    onAll(events: Events[], fn: Subscriber): (() => this)[];
    once(event: Events | "*", fn: Subscriber): () => this;
    onceAll(events: Events[], fn: Subscriber): (() => this)[];
    race(events: Events[], fn: Subscriber): (() => this)[];
    off(event: Events | "*", fn?: Subscriber): this;
    offAll(events: Events[], fn?: Subscriber): this;
    emit(event: Events, data?: any): this;
    emitAll(events: Events[], data?: any): this;
    getAllSubs(): Events[];
    middleware(event: Events | "*", fn: Middleware): () => void;
    private emitMiddlewares;
}
export declare const getEA: (name: string) => EventAggregator<string>;
