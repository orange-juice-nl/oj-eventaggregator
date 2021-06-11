"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAggregator = void 0;
var EventAggregator = /** @class */ (function () {
    function EventAggregator() {
        this.events = {};
    }
    EventAggregator.prototype.emit = function (event, data) {
        if (!this.events[event])
            return;
        this.events[event]
            .filter(function (x) { return !x.paused; })
            .forEach(function (x) { return x.fn(data, event); });
        return this;
    };
    EventAggregator.prototype.on = function (event, fn) {
        var _this = this;
        if (!this.events[event])
            this.events[event] = [];
        var sub = {
            fn: fn,
            off: function () { return _this.off(event, sub); },
            pause: function () { return sub.paused = true; },
            resume: function () { return sub.paused = false; },
        };
        this.events[event].push(sub);
        return sub;
    };
    EventAggregator.prototype.once = function (event, fn) {
        var sub = this.on(event, function (data) {
            sub.off();
            fn(data, event);
        });
        return sub;
    };
    EventAggregator.prototype.off = function (event, sub) {
        if (!this.events[event])
            return;
        var i = this.events[event].indexOf(sub);
        if (i === -1)
            return;
        this.events[event].splice(i, 1);
        return this;
    };
    EventAggregator.prototype.clear = function (event) {
        this.events[event].forEach(function (x) { return x.off(); });
        return this;
    };
    EventAggregator.prototype.emitAll = function (events, data) {
        var _this = this;
        events.forEach(function (event) { return _this.emit(event, data); });
        return this;
    };
    EventAggregator.prototype.onAll = function (events, fn) {
        var _this = this;
        return events.map(function (event) { return _this.on(event, function (data) { return fn(data, event); }); });
    };
    EventAggregator.prototype.onceAll = function (events, fn) {
        var _this = this;
        var subs = events.map(function (event) { return _this.once(event, function (data) {
            subs.forEach(function (x) { return x.off(); });
            fn(data, event);
        }); });
        return subs;
    };
    EventAggregator.prototype.clearAll = function (events) {
        var _this = this;
        events.forEach(function (event) { return _this.clear(event); });
        return this;
    };
    return EventAggregator;
}());
exports.EventAggregator = EventAggregator;
