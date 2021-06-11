type SubscriberFunction<Events extends Record<string, unknown>, K extends keyof Events> = (data: Events[K], event: K | "*") => any

type Subscriber<Events extends Record<string, unknown>, K extends keyof Events> = {
  fn: SubscriberFunction<Events, K>
  off: () => void
  pause: () => void
  resume: () => void
  paused?: boolean
}
export class EventAggregator<Events extends Record<string, unknown>> {
  events: Record<keyof Events, Subscriber<Events, keyof Events>[]> = {} as any

  emit<K extends keyof Events>(event: K, data: Events[K]) {
    if (!this.events[event])
      return

    this.events[event]
      .filter(x => !x.paused)
      .forEach(x => x.fn(data, event))

    return this
  }

  on<K extends keyof Events>(event: K, fn: SubscriberFunction<Events, K>) {
    if (!this.events[event])
      this.events[event] = []

    const sub: Subscriber<Events, K> = {
      fn,
      off: () => this.off(event, sub),
      pause: () => sub.paused = true,
      resume: () => sub.paused = false,
    }

    this.events[event].push(sub as any)

    return sub
  }

  once<K extends keyof Events>(event: K, fn: SubscriberFunction<Events, K>) {
    const sub = this.on(event, data => {
      sub.off()
      fn(data, event)
    })

    return sub
  }

  off<K extends keyof Events>(event: K, sub: Subscriber<Events, K>) {
    if (!this.events[event])
      return

    const i = this.events[event].indexOf(sub as any)
    if (i === -1)
      return

    this.events[event].splice(i, 1)

    return this
  }

  clear<K extends keyof Events>(event: K) {
    this.events[event].forEach(x => x.off())

    return this
  }

  emitAll<K extends Array<keyof Events>>(events: K, data: Events[K[0]]) {
    events.forEach(event => this.emit(event, data))

    return this
  }

  onAll<K extends Array<keyof Events>>(events: K, fn: SubscriberFunction<Events, K[0]>) {
    return events.map(event => this.on(event, data => fn(data, event)))
  }

  onceAll<K extends Array<keyof Events>>(events: K, fn: SubscriberFunction<Events, K[0]>) {
    const subs = events.map(event => this.once(event, data => {
      subs.forEach(x => x.off())
      fn(data, event)
    }))
    return subs
  }

  clearAll<K extends Array<keyof Events>>(events: K) {
    events.forEach(event => this.clear(event))

    return this
  }
}