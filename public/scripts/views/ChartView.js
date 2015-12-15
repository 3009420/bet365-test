window.Bet365 = window.Bet365 || {};
window.Bet365.views = window.Bet365.views || {};

window.Bet365.views.ChartView = (function(win){

    var BaseView = window.Bet365.views.BaseView;

    var ChartView = function(rootElememntId, collection){

        BaseView.call(this, rootElememntId);

        this.collection = collection;

    };

    ChartView.prototype = Object.create(BaseView.prototype);

    ChartView.prototype.render = function(){

        var getScale = function(height, value){
            

        };

        var axisColor = "#FFDF1B";

        var axisWidth = 1;

        var width = 600;

        var height = 450;

        var leftPadding = 20;

        var topPadding = 20;

        var rightPadding = 20;

        var bottomPadding = 20;

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

    };

    return ChartView;

})(this);