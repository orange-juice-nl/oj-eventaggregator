export type Subscriber = (data: any, event: string) => any
export type Middleware = (data: any, event: string) => any | null
export type Subscriptions = { [event: string]: Subscriber[] }

export class EventAggregator<Events extends string> {
  private subs: Subscriptions = {};
  private middlewares: Subscriptions = {};

  public on(event: Events | "*", fn: Subscriber): () => this {
    if (!this.subs[event]) this.subs[event] = []
    this.subs[event].push(fn)
    return () => this.off(event, fn)
  }

  public onAll(events: Events[], fn: Subscriber) {
    return events.map(event => this.on(event, data => fn(data, event)))
  }

  public once(event: Events | "*", fn: Subscriber) {
    const off = this.on(event, data => {
      off()
      fn(data, event)
    })
    return off
  }

  public onceAll(events: Events[], fn: Subscriber) {
    return events.map(event => this.once(event, data => fn(data, event)))
  }

  public race(events: Events[], fn: Subscriber) {
    const offs = events.map(event => this.on(event, data => {
      offs.forEach(x => x())
      fn(data, event)
    }))
    return offs
  }

  public off(event: Events | "*", fn?: Subscriber) {
    if (typeof fn !== "function") {
      if (this.subs[event])
        this.subs[event].length = 0
    }
    else {
      const i = this.subs[event].indexOf(fn)
      this.subs[event].splice(i, 1)
    }
    return this
  }

  public offAll(events: Events[], fn?: Subscriber) {
    events.forEach(event => this.off(event, fn))
    return this
  }

  public emit(event: Events, data?: any) {
    data = this.emitMiddlewares(event, data)
    if (data === null) return this
    if (this.subs[event]) this.subs[event].forEach(sub => sub(data, event))
    if (this.subs["*"]) this.subs["*"].forEach(sub => sub(data, event))
    return this
  }

  public emitAll(events: Events[], data?: any) {
    events.map(event => this.emit(event, data))
    return this
  }

  public getAllSubs() {
    return Object.keys(this.subs) as Events[]
  }

  public middleware(event: Events | "*", fn: Middleware) {
    if (!this.middlewares[event]) this.middlewares[event] = []
    this.middlewares[event].push(fn)
    return () => {
      const i = this.middlewares[event].indexOf(fn)
      this.middlewares[event].splice(i, 1)
    }
  }

  private emitMiddlewares(event: Events, data: any) {
    const mw = (e, d) => {
      if (!this.middlewares[e]) return d
      if (d === null) return null
      for (let i = 0; i < this.middlewares[e].length; i++) {
        d = this.middlewares[e][i](d, event)
        if (d === null) return null
      }
      return d
    }

    data = mw(event, data)
    data = mw("*", data)
    return data
  }
}


const instances: { [k: string]: EventAggregator<string> } = {}
export const getEA = (name: string) => {
  if (!instances[name]) instances[name] = new EventAggregator()
  return instances[name]
}