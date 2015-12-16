window.Bet365 = window.Bet365 || {};
window.Bet365.views = window.Bet365.views || {};

window.Bet365.views.ChartView = (function (win) {

    var BaseView = window.Bet365.views.BaseView;

    var ChartView = function (rootElememntId, collection) {

        var self = this;

        BaseView.call(this, rootElememntId);

        this.collection = collection;

        this.collection.on("updatedCollection", function (args) {

            self.render();
        });
    };

    ChartView.prototype = Object.create(BaseView.prototype);

    ChartView.prototype.render = function () {

        console.log("render called");

        var getGridPosition = function (maxValue, value, maxLength) {

            return Math.floor((value / maxValue) * maxLength);
        };

        var axisColor = "#FFDF1B";

        var backgroundColor = "#089168";

        var axisWidth = 1;

        var width = 600;

        var height = 450;

        var leftPadding = 50;

        var topPadding = 20;

        var rightPadding = 50;

        var bottomPadding = 30;

        var dataHistory = this.collection.getUpdateHistory();

        //console.log("dataHistory", dataHistory);

        var context = this.rootElement.getContext("2d");

        context.clearRect(0, 0, width, height);

        //draw x axis
        context.beginPath();
        context.moveTo(leftPadding, height - bottomPadding);
        context.lineTo(width - rightPadding, height - bottomPadding);
        context.lineWidth = axisWidth;
        context.strokeStyle = axisColor;
        context.stroke();

        //draw y axis
        context.beginPath();
        context.moveTo(leftPadding, height - bottomPadding);
        context.lineTo(leftPadding, topPadding);
        context.lineWidth = axisWidth;
        context.strokeStyle = axisColor;
        context.stroke();

        //get max y axis value;
        //var maxYAxisValue = this.collection.getiHighestPrice();

        //draw background
        context.fillStyle = backgroundColor;
        context.fillRect(leftPadding + axisWidth, topPadding, width - leftPadding - rightPadding, height - bottomPadding - topPadding - axisWidth);

        if (dataHistory.length < 2) {

            //draw no data text
            context.font = "16px Arial";
            context.fillStyle = axisColor;
            context.textAlign = "center";
            context.textBaseline = "bottom";
            context.fillText("No live data", ((width - leftPadding - rightPadding) / 2) + leftPadding, (height / 2));

        }

        //draw x axis label
        context.font = "bold 10px Arial";
        context.fillStyle = axisColor;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("Time (ms)", ((width - leftPadding - rightPadding) / 2) + leftPadding, height);

        //draw y axis label
        context.translate(width / 2, height / 2);
        context.rotate((3 * Math.PI) / 2);
        context.font = "bold 10px Arial";
        context.fillStyle = axisColor;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("Price", 0, -1 * ((width / 2) - (leftPadding / 2)));
        context.rotate(Math.PI / 2);
        context.translate(-1 * (width / 2), -1 * (height / 2));

        var axisFont = "10px Arial";

        //if we have more than one input then draw points on graph
        if (dataHistory.length > 1) {

            var yAxisTickLineLength = 5;

            var xAxisTickLineLength = 5;

            //build x axis ticks

            var buildYAxis = function (highestPrice, numOfTicks, percentOfAxis) {

                var drawYAxisTick = function (topValue, yValue) {

                    var yPos;

                    if (yValue == 0) {

                        yPos = -1 * bottomPadding;

                    } else {

                        yPos = -1 * getGridPosition(topValue, yValue, height - topPadding);
                    }

                    context.translate(0, height);
                    //context.scale(1, -1);

                    context.beginPath();
                    context.moveTo(leftPadding - yAxisTickLineLength, yPos);
                    context.lineTo(leftPadding, yPos);
                    context.lineWidth = axisWidth;
                    context.strokeStyle = axisColor;
                    context.stroke();

                    context.font = axisFont;
                    context.textAlign = "right";
                    context.textBaseline = "middle";
                    context.fillText("" + yValue, leftPadding - 8, yPos);

                    //context.scale(1, -1);
                    context.translate(0, -1 * height);                    //context.translate(0, height);
                };

                var topTick = Math.floor((highestPrice / percentOfAxis) * 100);

                var tickInterval = Math.floor(topTick / numOfTicks);

                drawYAxisTick(topTick, topTick);

                for (var i = (numOfTicks - 1); i > 0; i--) {

                    drawYAxisTick(topTick, i * tickInterval);
                }

                drawYAxisTick(topTick, 0);
            };

            var buildXAxis = function (totalTime, numberOfTicks, percentageOfAxis) {

                var drawXAxisTick = function (totalValue, value) {

                    var xPos;

                    if (value == 0) {

                        xPos = leftPadding;
                    } else {

                        xPos = getGridPosition(totalValue, value, width - leftPadding - rightPadding) + leftPadding;
                    }

                    context.beginPath();
                    context.moveTo(xPos, height - bottomPadding);
                    context.lineTo(xPos, height - bottomPadding + xAxisTickLineLength);
                    context.lineWidth = axisWidth;
                    context.strokeStyle = axisColor;
                    context.stroke();

                    context.font = axisFont;
                    context.textAlign = "center";
                    context.textBaseline = "bottom";
                    context.fillText("" + value, xPos, height - bottomPadding + 20);
                };

                drawXAxisTick(totalTime, totalTime);

                var tickInterval = Math.floor(totalTime / numberOfTicks);

                for (var i = numberOfTicks - 1; i > 0; i--) {

                    drawXAxisTick(totalTime, Math.floor(tickInterval * i));
                }

                drawXAxisTick(totalTime, 0);

            };

            var pointRadius = 2;

            var percentageOfYAxis = 80;

            var percentageOfXAxis = 70;

            var plotPoint = function (totalTime, tick, totalPrice, price) {

                console.log("plot point", tick);

                var xPos;

                if (tick == 0) {
                    xPos = leftPadding;
                } else {
                    xPos = getGridPosition(totalTime, tick, width - leftPadding - rightPadding) + leftPadding;
                }

                var yPos = -1 * getGridPosition((totalPrice / percentageOfYAxis) * 100, price, height - topPadding);

                context.translate(0, height);

                context.beginPath();
                context.arc(xPos, yPos, pointRadius, 0, 2 * Math.PI);
                context.fillStyle = "#fff";
                context.fill();

                context.translate(0, -1 * height);

            };

            var drawLine = function (prevTick, prevPrice, nextTick, nextPrice) {

            };

            var numOfXAxisTicks = 6;

            var numOfYAxisTick = 4;

            var highestPrice = this.collection.highestPrice;

            var totalTime = this.collection.totalTime;

            //build y axis ticks
            buildYAxis(highestPrice, numOfYAxisTick, percentageOfYAxis);

            buildXAxis(totalTime, numOfXAxisTicks, percentageOfXAxis);

            var historyLen = dataHistory.length;

            for (var i = 0; i < historyLen; i++){

                plotPoint(totalTime, dataHistory[i][0]["tick"], highestPrice, parseInt(dataHistory[i][0]["Price"]));
            }

            //plot first point
        }

    };

    return ChartView;

})(this);