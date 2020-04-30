"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventAggregator = /** @class */ (function () {
    function EventAggregator() {
        this.subs = {};
        this.middlewares = {};
    }
    EventAggregator.prototype.on = function (event, fn) {
        var _this = this;
        if (!this.subs[event])
            this.subs[event] = [];
        this.subs[event].push(fn);
        return function () { return _this.off(event, fn); };
    };
    EventAggregator.prototype.onAll = function (events, fn) {
        var _this = this;
        return events.map(function (event) { return _this.on(event, function (data) { return fn(data, event); }); });
    };
    EventAggregator.prototype.once = function (event, fn) {
        var off = this.on(event, function (data) {
            off();
            fn(data, event);
        });
        return off;
    };
    EventAggregator.prototype.onceAll = function (events, fn) {
        var _this = this;
        return events.map(function (event) { return _this.once(event, function (data) { return fn(data, event); }); });
    };
    EventAggregator.prototype.race = function (events, fn) {
        var _this = this;
        var offs = events.map(function (event) { return _this.on(event, function (data) {
            offs.forEach(function (x) { return x(); });
            fn(data, event);
        }); });
        return offs;
    };
    EventAggregator.prototype.off = function (event, fn) {
        if (typeof fn !== "function") {
            if (this.subs[event])
                this.subs[event].length = 0;
        }
        else {
            var i = this.subs[event].indexOf(fn);
            this.subs[event].splice(i, 1);
        }
        return this;
    };
    EventAggregator.prototype.offAll = function (events, fn) {
        var _this = this;
        events.forEach(function (event) { return _this.off(event, fn); });
        return this;
    };
    EventAggregator.prototype.emit = function (event, data) {
        data = this.emitMiddlewares(event, data);
        if (data === null)
            return this;
        if (this.subs[event])
            this.subs[event].forEach(function (sub) { return sub(data, event); });
        if (this.subs["*"])
            this.subs["*"].forEach(function (sub) { return sub(data, event); });
        return this;
    };
    EventAggregator.prototype.emitAll = function (events, data) {
        var _this = this;
        events.map(function (event) { return _this.emit(event, data); });
        return this;
    };
    EventAggregator.prototype.getAllSubs = function () {
        return Object.keys(this.subs);
    };
    EventAggregator.prototype.middleware = function (event, fn) {
        var _this = this;
        if (!this.middlewares[event])
            this.middlewares[event] = [];
        this.middlewares[event].push(fn);
        return function () {
            var i = _this.middlewares[event].indexOf(fn);
            _this.middlewares[event].splice(i, 1);
        };
    };
    EventAggregator.prototype.emitMiddlewares = function (event, data) {
        var _this = this;
        var mw = function (e, d) {
            if (!_this.middlewares[e])
                return d;
            if (d === null)
                return null;
            for (var i = 0; i < _this.middlewares[e].length; i++) {
                d = _this.middlewares[e][i](d, event);
                if (d === null)
                    return null;
            }
            return d;
        };
        data = mw(event, data);
        data = mw("*", data);
        return data;
    };
    return EventAggregator;
}());
exports.EventAggregator = EventAggregator;
var instances = {};
exports.getEA = function (name) {
    if (!instances[name])
        instances[name] = new EventAggregator();
    return instances[name];
};
