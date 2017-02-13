"use strict";

goog.provide("Entry.Restrictor");

goog.require("Entry.Utils");

Entry.Restrictor = function() {
    this.startEvent = new Entry.Event(this);
    this.endEvent = new Entry.Event(this);

    this.currentTooltip = null;
};

(function(p) {
    p.restrict = function(data) {
        var log = data.content.concat();
        var commandType = log.shift();
        var command = Entry.Command[commandType];
        var domQuery = command.dom;
        if (!domQuery)
            return;

        if (domQuery instanceof Array) {
            domQuery = domQuery.map(function(q) {
                if (q[0] === "&")
                    return log[Number(q.substr(1))][1];
                else
                    return q;
            });
        }

        if (!data.tooltip)
            data.tooltip = {
                title: "액션",
                content: "지시 사항을 따르시오"
            };

        if (command.restrict) {
            this.currentTooltip = command.restrict(
                data, domQuery, this.restrictEnd.bind(this));
            return;
        } else {
            this.currentTooltip = new Entry.Tooltip([{
                title: data.tooltip.title,
                content: data.tooltip.content,
                target: domQuery,
                direction: "down"
            }], {
                restrict: true,
                dimmed: true,
                callBack: this.restrictEnd.bind(this)
            });
        }

        this.startEvent.notify();
    };

    p.end = function() {
        if (this.currentTooltip) {
            this.currentTooltip.dispose();
            this.currentTooltip = null;
        }
    };

    p.restrictEnd = function() {
        this.endEvent.notify();
        this.currentTooltip = null;
    };

    p.align = function() {
        if (this.currentTooltip)
            this.currentTooltip.alignTooltips();
    };
})(Entry.Restrictor.prototype);
