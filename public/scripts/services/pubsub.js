window.Bet365 = window.Bet365 || {};
window.Bet365.services = window.Bet365.services || {};

window.Bet365.services.PubSub = (function(win) {
    var PubSub = function(){

        this.topics = {};
        this.subUid = -1;
    };

    PubSub.subscribe = function(topic, func) {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        var token = (++this.subUid).toString();
        this.topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };

    PubSub.publish = function(topic, args) {
        if (!this.topics[topic]) {
            return false;
        }
        setTimeout(function() {
            var subscribers = this.topics[topic],
                len = subscribers ? subscribers.length : 0;

            while (len--) {
                subscribers[len].func(topic, args);
            }
        }, 0);
        return true;

    };

    PubSub.unsubscribe = function(token) {
        for (var m in this.topics) {
            if (this.topics[m]) {
                for (var i = 0, j = this.topics[m].length; i < j; i++) {
                    if (this.topics[m][i].token === token) {
                        this.topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    };

    return PubSub;

}(this));