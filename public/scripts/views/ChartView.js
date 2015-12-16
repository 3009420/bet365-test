window.Bet365 = window.Bet365 || {};
window.Bet365.views = window.Bet365.views || {};

window.Bet365.views.ChartView = (function(win){

    var BaseView = window.Bet365.views.BaseView;

    var ChartView = function(rootElememntId, collection){

        var self = this;

        BaseView.call(this, rootElememntId);

        this.collection = collection;

        this.collection.on("updatedModel", function(){

            self.render();
        });
    };

    ChartView.prototype = Object.create(BaseView.prototype);

    ChartView.prototype.render = function(){

        var getGridPosition = function(maxValue, xValue, maxLength){

            return (xValue / maxXValue) * maxLength;
        };

        var axisColor = "#FFDF1B";

        var axisWidth = 1;

        var width = 600;

        var height = 450;

        var leftPadding = 20;

        var topPadding = 20;

        var rightPadding = 20;

        var bottomPadding = 20;

        var dataHistory = this.collection.getUpdateHistory();

        console.log("dataHistory", dataHistory);

        var context = this.rootElement.getContext("2d");

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
        context.fillText("No live data", (width / 2), (height / 2));

        //draw x axis label
        context.font = "10px Arial";
        context.fillStyle = axisColor;
        context.textAlign = "center";
        context.fillText("Time (ms)", width / 2, height);

        //draw y axis label
        context.translate(width / 2, height / 2);
        context.rotate((3 * Math.PI)/2);
        context.font = "10px Arial";
        context.fillStyle = axisColor;
        context.textAlign = "center";
        context.fillText("Price", 0, -1 * ((width / 2) - (leftPadding / 2)));

    };

    return ChartView;

})(this);