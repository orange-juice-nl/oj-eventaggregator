"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAggregator = void 0;
var EventAggregator = /** @class */ (function () {
    function EventAggregator() {
        this.events = {};
        this.paused = false;
    }
    EventAggregator.prototype.emit = function (event, data) {
        var _a, _b;
        if (this.paused)
            return this;
        (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return !x.paused; }).forEach(function (x) { return x.fn(data, event); });
        (_b = this.events["*"]) === null || _b === void 0 ? void 0 : _b.filter(function (x) { return !x.paused; }).forEach(function (x) { return x.fn(data, event); });
        return this;
    };
    EventAggregator.prototype.on = function (event, fn) {
        var _this = this;
        var _a;
        var _b;
        (_a = (_b = this.events)[event]) !== null && _a !== void 0 ? _a : (_b[event] = []);
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
        var sub = this.on(event, function (d, e) {
            sub.off();
            fn(d, e);
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
    EventAggregator.prototype.emitMultiple = function (events, data) {
        var _this = this;
        events.forEach(function (event) { return _this.emit(event, data); });
        return this;
    };
    EventAggregator.prototype.onMultiple = function (events, fn) {
        var _this = this;
        return events.map(function (event) { return _this.on(event, function (d, e) { return fn(d, e); }); });
    };
    EventAggregator.prototype.onceMultiple = function (events, fn) {
        var _this = this;
        var subs = events.map(function (event) { return _this.once(event, function (d, e) {
            subs.forEach(function (x) { return x.off(); });
            fn(d, e);
        }); });
        return subs;
    };
    EventAggregator.prototype.clearMultiple = function (events) {
        var _this = this;
        events.forEach(function (event) { return _this.clear(event); });
        return this;
    };
    EventAggregator.prototype.pause = function () {
        this.paused = true;
        return this;
    };
    EventAggregator.prototype.resume = function () {
        this.paused = false;
        return this;
    };
    return EventAggregator;
}());
exports.EventAggregator = EventAggregator;
