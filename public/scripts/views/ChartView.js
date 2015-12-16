window.Bet365 = window.Bet365 || {};
window.Bet365.views = window.Bet365.views || {};

window.Bet365.views.ChartView = (function(win){

    var BaseView = window.Bet365.views.BaseView;

    var ChartView = function(rootElememntId, collection){

        var self = this;

        BaseView.call(this, rootElememntId);

        this.collection = collection;

        this.collection.on("updatedCollection", function(args){

            self.render();
        });
    };

    ChartView.prototype = Object.create(BaseView.prototype);

    ChartView.prototype.render = function(){


        var getGridPosition = function(maxValue, value, maxLength){

            return Math.floor((value / maxValue) * maxLength);
        };

        var axisColor = "#FFDF1B";

        var axisWidth = 1;

        var width = 600;

        var height = 450;

        var leftPadding = 40;

        var topPadding = 20;

        var rightPadding = 20;

        var bottomPadding = 20;

        var dataHistory = this.collection.getUpdateHistory();

        //console.log("dataHistory", dataHistory);

        var context = this.rootElement.getContext("2d");

        context.clearRect(0, 0, width, height);

        //draw x axis
        context.beginPath();
        context.moveTo(leftPadding, height - bottomPadding);
        context.lineTo(width, height - bottomPadding);
        context.lineWidth = axisWidth;
        context.strokeStyle = axisColor;
        context.stroke();

        //draw y axis
        context.beginPath();
        context.moveTo(leftPadding, bottomPadding);
        context.lineTo(leftPadding, height - topPadding);
        context.lineWidth = axisWidth;
        context.strokeStyle = axisColor;
        context.stroke();

        //get max y axis value;
        //var maxYAxisValue = this.collection.getHighestPrice();

        //draw no data text
        context.font = "16px Arial";
        context.fillStyle = axisColor;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("No live data", ((width - leftPadding) / 2) + leftPadding, (height / 2));

        //draw x axis label
        context.font = "10px Arial";
        context.fillStyle = axisColor;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("Time (ms)", ((width - leftPadding) / 2) + leftPadding, height);

        //draw y axis label
        context.translate(width / 2, height / 2);
        context.rotate((3 * Math.PI)/2);
        context.font = "10px Arial";
        context.fillStyle = axisColor;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("Price", 0, -1 * ((width / 2) - (leftPadding / 2)));
        context.rotate(Math.PI/2);
        context.translate(-1 * (width / 2), -1 * (height / 2));

        var axisFont = "10px Arial";

        //if we have more than one input then draw points on graph
        if (dataHistory.length > 1){

            var yAxisTickLineLength = 5;

            //build x axis ticks

            var buildYAxis = function(highestPrice, numOfTicks, percentOfAxis){

                var drawYAxisTick = function(topValue, yValue){

                    console.log("drawYAxisTick called x pos:", getGridPosition(topValue, yValue, height - topPadding));

                    context.translate(0, height);
                    context.scale(1, -1);

                    context.beginPath();
                    context.moveTo(leftPadding - yAxisTickLineLength, getGridPosition(topValue, yValue, height - topPadding));
                    context.lineTo(leftPadding, getGridPosition(topValue, yValue, height - topPadding));
                    context.lineWidth = axisWidth;
                    context.strokeStyle = axisColor;
                    context.stroke();

                    context.scale(1, -1);
                    context.translate(0, -1 * height);

                    /*context.font = axisFont;
                    context.textAlign = "left";
                    context.textBaseline = "middle";
                    context.fillText("" + yValue, leftPadding / 3, getGridPosition(topValue, yValue, height + topPadding));*/

                    //context.translate(0, height);
                };

                var topTick = Math.floor((highestPrice / 80) * 100);

                var tickInterval = Math.floor(topTick / numOfTicks);

                //
                drawYAxisTick(topTick, topTick);

                for (var i = (numOfTicks - 1); i > 0; i--){

                    console.log("i * tickInterval", i * tickInterval);

                    drawYAxisTick(topTick, i * tickInterval);
                }
            };

            var pointRadius = 5;

            var percentageOfYAxis = 80;

            var plotPoint = function(tick, price){

                //context.beginPath();
                //context.arc(0,)

            };

            var drawLine = function(prevTick, prevPrice, nextTick, nextPrice){

            };

            var numOfXAxisTicks = 6;

            var numOfYAxisTick = 4;

            var highestPrice = this.collection.highestPrice;

            //build y axis ticks
            buildYAxis(highestPrice, numOfYAxisTick, percentageOfYAxis);

            //plot first point

            //plotPoint(0, dataHistory[0]["Price"]);


        }

    };

    return ChartView;

})(this);