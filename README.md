# EventAggregator

## Usage

### import
```typescript
import { EventAggregator, getEA } from "oj-eventaggregator";
```

### create an instance
```typescript
const ea = new EventAggregator();
```

### or use a global instance (Singleton)
shared between imports

```typescript
const ea = getEA("myGlobalEA")
```

### subscribe to an event
subscribers with "*" listen to all events

```typescript
ea.on("*", (data, event) => console.log) // true, "edit" ...

ea.on("edit", editing => {
  element.classList.toggle("is-editing", editing)
})

ea.onAll(["a","b"], editing => {
  // called only for events a and b
})
```

### subscribe only once
```typescript
ea.once("resize", data => {
  // called only once
});
```

### (race) subscribe only to the first emit of multiple events
```typescript
ea.race(["resize", "scroll"], (event) => {
  // called only once
});
```

### emit an event
```typescript
ea.emit("edit", true)

window.addEventListener("resize", event => 
  ea.emit("resize", event))

// multipe
ea.emitAll(["a", "b"])
```

### unsubscribe a subscription
```typescript
const unsubResize = ea.on("resize", (data) => {...});
unsubResize();
```

### get all subscribers
```typescript
ea.getAllSubs() // ["*", "edit", "a", "b"]
```

### attach middleware
Modify data before the subscribers get notified.
Return null to stop the event.

```typescript
ea.on("userChange", user => {
  console.log(user.name, user.age)
})

ea.middleware("userChange", user => ({
  ...user, name: user.name + " Doe"
}))

ea.middleware("userChange", user => {
  if (user.age < 20)
    return null
  return user
}

ea.emit("userChange", { name: "John", age: 22 }) // John Doe, 22

ea.emit("userChange", { name: "Jane", age: 18 }) // never
```

## Types

### EventAggregator<Events extends string>

### Subscriber 
```typescript
(data: any, event: string) => any
```
### Middleware 
```typescript
(data: any, event: string) => any | null
```
### Subscriptions
```typescript
{ [event: string]: Subscriber[] }
```