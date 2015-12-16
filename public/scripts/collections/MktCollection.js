window.Bet365 = window.Bet365 || {};
window.Bet365.collections = window.Bet365.collections || {};

window.Bet365.collections.MktCollection = (function(win){

    var BaseCollection = window.Bet365.collections.BaseCollection,
        MktCollection = function(){

            BaseCollection.apply(this, arguments);

            this.history = [this.data];
            this.highestPrice = this.getHighestPrice(0, this.data);
            this.totalTime = 0;
        };

    MktCollection.prototype = Object.create(BaseCollection.prototype);

    MktCollection.prototype.getUpdateHistory = function(){
        return this.history;
    };

    MktCollection.prototype.updateDeltas = function(rows, tick){

        var rowsLen = rows.length;

        for (var i = 0; i < rowsLen; i++){

            rows[i][2].length > 0 ? this.data[i]["Price"] = rows[i][2] : null;

            if (rows[i][2].length > 0){

                this.data[i]["Price"] = rows[i][2];
                this.fire("updatedModel", [i, "Price", rows[i][2]]);
            }

            if (rows[i][3].length > 0){

                this.data[i]["Change"] = rows[i][3];
                this.fire("updatedModel", [i, "Change", rows[i][3]]);
            }

            if (rows[i][4].length > 0){

                this.data[i]["Chg %"] = rows[i][4];
                this.fire("updatedModel", [i, "Chg %", rows[i][4]]);
            }

            this.data[i]["tick"] = parseInt(tick);
        }

        this.highestPrice = this.getHighestPrice(this.highestPrice, this.data);
        this.setTotalTime(tick);

        //console.log("this.data.tick", this.data.tick);

        this.history.push(this.copyData(this.data));
        this.fire("updatedCollection");
    };

    MktCollection.prototype.setTotalTime = function(tick){

        this.totalTime = this.totalTime + parseInt(tick);
    }

    MktCollection.prototype.getHighestPrice = function(highestPrice, data){

        var value,
            dataLen = data.length;

        for (var i = 0; i < dataLen; i++){

            value = parseInt(data[i]["Price"]);

            if (highestPrice < value){
                highestPrice = value;
            }
        }

        return highestPrice;
    };

    return MktCollection;

})(this);