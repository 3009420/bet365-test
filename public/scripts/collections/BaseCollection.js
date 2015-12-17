window.Bet365 = window.Bet365 || {};
window.Bet365.collections = window.Bet365.collections || {};

window.Bet365.collections.BaseCollection = (function(win){

    var BaseCollection = function(Model, data){

        this.Model = Model;
        this.data = data;
        this.events = {};
    };

    BaseCollection.prototype.copyData = function(data){

        var retObj,
            ret = [],
            dataLen = data.length;

        for (var i = 0; i < dataLen; i++){

            retObj = {};

            for (var item in data[i]){

                retObj[item] = data[i][item];
            }

            ret.push(retObj);
        }

        return ret;
    };

    BaseCollection.prototype.forEach = function(forEachFunc){

        var dataLen = this.data.length;

        for (var i = 0; i < dataLen; i ++){

            forEachFunc(new this.Model(this.data[i]), i);
        }
    };

    BaseCollection.prototype.on = function(eventName, eventHandler){

        typeof this.events[eventName] === "undefined" ? this.events[eventName] = [eventHandler] : this.events[eventName].push(eventHandler);
    };

    BaseCollection.prototype.fire = function(eventName, arguments){

        var eventsLen;

        if (typeof this.events[eventName] !== "undefined"){

            eventsLen = this.events[eventName].length;

            for (var i = 0; i < eventsLen; i++){

                this.events[eventName][i].call(this, arguments);
            }
        }
    };

    return BaseCollection;

})(this);