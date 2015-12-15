window.Bet365 = window.Bet365 || {};
window.Bet365.collections = window.Bet365.collections || {};

window.Bet365.collections.MktCollection = (function(win){

    var BaseCollection = window.Bet365.collections.BaseCollection,
        MktCollection = function(){

            BaseCollection.apply(this, arguments);
        };

    MktCollection.prototype = Object.create(BaseCollection.prototype);

    MktCollection.prototype.updateDeltas = function(rows){

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
        }
    };

    MktCollection.prototype.getHighestPrice = function(){

        var value,
            highestPrice = 0,
            dataLen = this.data.length;

        for (var i = 0; i < dataLen; i++){

            value = parseInt(this.data[i]["Price"]);

            if (highestPrice < value){
                highestPrice = value;
            }
        }

        return highestPrice;
    };

    return MktCollection;

})(this);