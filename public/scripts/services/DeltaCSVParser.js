window.Bet365 = window.Bet365 || {};
window.Bet365.services = window.Bet365.services || {};

window.Bet365.services.DeltaCSVParser = (function(win){

    var CsvParser = window.Bet365.services.CSVParser;

    var DeltaCSVParser = function(){

        CsvParser.apply(this, arguments);
    };

    DeltaCSVParser.prototype = Object.create(CsvParser.prototype);

    DeltaCSVParser.prototype.getDeltas = function(callback){

        var self = this,
            responseHandler = function(responseType, responseText){

                var row,
                    deltaSet = [],
                    rows = responseText.split("\n"),
                    rowsLen = rows.length,
                    getDeltas = function(i){

                        if (!isNaN(parseInt(rows[i]))){

                            self.fire("updated", deltaSet);
                            deltaSet = [];

                            setTimeout(function(){

                                i++;
                                getDeltas(i)
                            }, parseInt(rows[i]))
                            ;
                        } else if (i < rowsLen) {

                            row = rows[i].split(",");
                            deltaSet.push(row);

                            i++;
                            getDeltas(i);
                        } else {
                            self.getFile(self.path, responseHandler);
                        }
                    };

                getDeltas(0);

            };

        this.getFile(this.path, responseHandler);
    };

    return DeltaCSVParser;

})(this);