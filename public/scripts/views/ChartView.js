window.Bet365 = window.Bet365 || {};
window.Bet365.views = window.Bet365.views || {};

window.Bet365.views.ChartView = (function (win) {

    var BaseView = window.Bet365.views.BaseView;

    var ChartView = function (rootElememntId, collection, seriesConfig, chartConfig) {

        var self = this;

        BaseView.call(this, rootElememntId);

        this.width = chartConfig.width;
        this.height = chartConfig.height;
        this.axisColor = chartConfig.axisColor;
        this.lineWidth = chartConfig.lineWidth;
        this.backgroundColor = chartConfig.backgroundColor;
        this.axisWidth = chartConfig.axisWidth;

        this.leftPadding = 50;
        this.topPadding = 20;
        this.rightPadding = 50;
        this.bottomPadding = 70;
        this.axisFont = "10px Arial";
        this.yAxisTickLineLength = 5;
        this.xAxisTickLineLength = 5;
        this.seriesConfig = seriesConfig;
        this.collection = collection;

        this.collection.on("updatedCollection", function (args) {
            self.render();
        });
    };

    ChartView.prototype = Object.create(BaseView.prototype);

    ChartView.prototype.clearCanvas = function (context) {

        context.clearRect(0, 0, this.width, this.height);
    };

    ChartView.prototype.getGridPosition = function (maxValue, value, maxLength) {

        return Math.floor(value / (maxValue) * maxLength);
    };

    ChartView.prototype.buildYAxis = function (topTickValue, numOfTicks, bottomTickValue, context) {

        var tickInterval = Math.floor((topTickValue - bottomTickValue) / (numOfTicks - 1));

        this.drawYAxisTick(topTickValue, bottomTickValue, topTickValue, context);

        for (var i = (numOfTicks - 2); i > 0; i--) {

            this.drawYAxisTick(topTickValue, bottomTickValue, i * tickInterval, context);
        }

        this.drawYAxisTick(topTickValue, bottomTickValue, bottomTickValue, context);
    };

    ChartView.prototype.drawYAxisTick = function (topValue, bottomValue, yValue, context) {

        var yPos;

        if (yValue == 0) {
            yPos = -1 * this.bottomPadding;
        } else {
            yPos = -1 * this.getGridPosition(topValue, yValue, this.height - this.topPadding - this.bottomPadding, bottomValue) - this.bottomPadding;
        }

        context.translate(0, this.height);
        context.beginPath();
        context.moveTo(this.leftPadding - this.yAxisTickLineLength, yPos);
        context.lineTo(this.leftPadding, yPos);
        context.lineWidth = this.axisWidth;
        context.strokeStyle = this.axisColor;
        context.stroke();
        context.font = this.axisFont;
        context.textAlign = "right";
        context.textBaseline = "middle";
        context.fillText("" + yValue, this.leftPadding - 8, yPos);
        context.translate(0, -1 * this.height);
    };

    ChartView.prototype.drawXAxisTick = function (totalValue, value, context) {

        var xPos;

        if (value == 0) {

            xPos = this.leftPadding;
        } else {
            xPos = this.getGridPosition(totalValue, value, this.width - this.leftPadding - this.rightPadding) + this.leftPadding;
        }

        context.beginPath();
        context.moveTo(xPos, this.height - this.bottomPadding);
        context.lineTo(xPos, this.height - this.bottomPadding + this.xAxisTickLineLength);
        context.lineWidth = this.axisWidth;
        context.strokeStyle = this.axisColor;
        context.stroke();

        context.font = this.axisFont;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("" + value, xPos, this.height - this.bottomPadding + 20);
    };

    ChartView.prototype.buildXAxis = function (totalTime, numberOfTicks, totalAxisValue, context) {

        this.drawXAxisTick(totalAxisValue, totalAxisValue, context);

        var tickInterval = Math.floor(totalAxisValue / numberOfTicks);

        for (var i = numberOfTicks - 1; i > 0; i--) {

            this.drawXAxisTick(totalAxisValue, Math.floor(tickInterval * i), context);
        }

        this.drawXAxisTick(totalAxisValue, 0, context);
    };

    ChartView.prototype.getPosition = function (totalTime, tick, totalPrice, price, lowestPrice) {

        var xPos;

        if (tick == 0) {
            xPos = leftPadding;
        } else {
            xPos = this.getGridPosition(totalTime, tick, this.width - this.leftPadding - this.rightPadding) + this.leftPadding;
        }


        var yPos = -1 * this.getGridPosition(totalPrice, price, this.height - this.topPadding - this.bottomPadding, lowestPrice) - this.bottomPadding;

        return [xPos, yPos];

    };

    ChartView.prototype.plotPoint = function (xPos, yPos, color, context) {

        context.translate(0, this.height);

        context.beginPath();

        context.arc(xPos, yPos, 3, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();

        context.translate(0, -1 * this.height);

    };

    ChartView.prototype.drawLine = function (prevX, prevY, nextX, nextY, color, context) {

        context.translate(0, this.height);

        context.beginPath();
        context.moveTo(prevX, prevY);
        context.lineTo(nextX, nextY);
        context.lineWidth = this.lineWidth;
        context.strokeStyle = color;
        context.stroke();

        context.translate(0, -1 * this.height);

    };

    ChartView.prototype.render = function () {

        var percentageOfYAxis,
            percentageOfXAxis,
            numOfXAxisTicks,
            numOfYAxisTicks,
            highestPrice,
            totalTime,
            lowestPrice,
            totalXAxisValue,
            totalYAxisValue,
            dataHistory = this.collection.getUpdateHistory(),
            context = this.rootElement.getContext("2d");

        //clear canvas
        this.clearCanvas(context);

        //draw x axis
        context.beginPath();
        context.moveTo(this.leftPadding, this.height - this.bottomPadding);
        context.lineTo(this.width - this.rightPadding, this.height - this.bottomPadding);
        context.lineWidth = this.axisWidth;
        context.strokeStyle = this.axisColor;
        context.stroke();

        //draw y axis
        context.beginPath();
        context.moveTo(this.leftPadding, this.height - this.bottomPadding);
        context.lineTo(this.leftPadding, this.topPadding);
        context.lineWidth = this.axisWidth;
        context.strokeStyle = this.axisColor;
        context.stroke();

        //draw background
        context.fillStyle = this.backgroundColor;
        context.fillRect(this.leftPadding + this.axisWidth, this.topPadding, this.width - this.leftPadding - this.rightPadding, this.height - this.bottomPadding - this.topPadding - this.axisWidth);

        //draw no data message when we have only a single set of data in the collection
        if (dataHistory.length < 2) {

            //draw no data text
            context.font = "16px Arial";
            context.fillStyle = this.axisColor;
            context.textAlign = "center";
            context.textBaseline = "bottom";
            context.fillText("No live data", ((this.width - this.leftPadding - this.rightPadding) / 2) + this.leftPadding, ((this.height - this.bottomPadding) / 2));
        }

        //draw x axis label
        context.font = "bold " + this.axisFont;
        context.fillStyle = this.axisColor;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("Time (ms)", ((this.width - this.leftPadding - this.rightPadding) / 2) + this.leftPadding, this.height - this.bottomPadding + 30);

        //draw y axis label
        context.translate(this.width / 2, (this.height - this.bottomPadding) / 2);
        context.rotate((3 * Math.PI) / 2);
        context.font = "bold " + this.axisFont;
        context.fillStyle = this.axisColor;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("Price (pence)", 0, -1 * ((this.width / 2) - (this.leftPadding / 2)));
        context.rotate(Math.PI / 2);
        context.translate(-1 * (this.width / 2), -1 * (this.height - this.bottomPadding) / 2);


        //if we have more than one input then draw points on graph
        if (dataHistory.length > 1) {

            percentageOfYAxis = 80;
            percentageOfXAxis = 90;
            numOfXAxisTicks = 6;
            numOfYAxisTicks = 4;
            highestPrice = this.collection.highestPrice;
            totalTime = this.collection.totalTime;
            lowestPrice = this.collection.lowestPrice;
            totalXAxisValue = Math.floor((totalTime / percentageOfXAxis) * 100);
            totalYAxisValue = Math.floor((highestPrice / percentageOfYAxis) * 100);

            //build y axis ticks
            this.buildYAxis(totalYAxisValue, numOfYAxisTicks, lowestPrice, context);
            this.buildXAxis(totalTime, numOfXAxisTicks, totalXAxisValue, context);

            //TODO: draw key for each series in chart
            //buildSeriesKey(this.seriesConfig);

            var historyLen = dataHistory.length;

            var seriesConfLen = this.seriesConfig.length;

            for (var i = 0; i < historyLen; i++) {

                for (var x = 0; x < seriesConfLen; x++) {

                    var pos = this.getPosition(totalXAxisValue, dataHistory[i][x]["tick"], totalYAxisValue, parseInt(dataHistory[i][x]["Price"]), lowestPrice);

                    this.plotPoint(pos[0], pos[1], this.seriesConfig[x].color, context);

                    if (i > 0) {
                        var prevPos = this.getPosition(totalXAxisValue, dataHistory[i - 1][x]["tick"], totalYAxisValue, parseInt(dataHistory[i - 1][x]["Price"]), lowestPrice);
                        this.drawLine(prevPos[0], prevPos[1], pos[0], pos[1], this.seriesConfig[x].color, context);
                    }
                }
            }
        }
    };

    return ChartView;

})
(this);