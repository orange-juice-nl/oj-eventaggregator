# EventAggregator

## Usage

### import
```typescript

import { EventAggregator } from "oj-eventaggregator";

```

### create an instance
```typescript

const ea = new EventAggregator<{
  "edit": boolean,
  "event": any,
  "another": any,
}>()

```

### subscribe to an event
subscribers with "*" listen to all events

```typescript

ea.on("edit", editing => element.classList.toggle("is-editing", editing))

ea.once("event", (data, event) => {})
ea.onMultiple(["event", "another"], (data, event) => {})
ea.onceMultiple(["event", "another"], (data, event) => {}) // callback will get called only once

```

### emit an event
```typescript

editBtn.addEventListener("click", e => ea.emit("edit", true))

ea.emitMultiple(["event", "another"], data)

```

### unsubscribe a subscription
```typescript

const sub = ea.on("event", (data, event) => {})
sub.off()

ea.clear("event") // removes all subscribers
ea.clearMultiple(["event", "another"])

```

### pause / resume a subscription
```typescript

const sub = ea.on("event", (data, event) => {})
sub.pause()
// sub does not respond to "event" emits
sub.resume()

ea.pause()
// eventaggregator does not emit any events
ea.resume()

```