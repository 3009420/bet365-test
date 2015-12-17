window.Bet365 = window.Bet365 || {};

window.Bet365.app = (function(win){

    var gridView,
        chartView,
        mktDataCollection,
        csvParser,
        deltaCSVParser,
        getStatsBtn;

    var init = function(){

        var isUpdating = false,
            CSVParser = win.Bet365.services.CSVParser,
            DeltaCSVParser = win.Bet365.services.DeltaCSVParser,
            MktDataCollection = win.Bet365.collections.MktCollection,
            BaseModel = win.Bet365.models.BaseModel,
            GridView = win.Bet365.views.GridView,
            ChartView = win.Bet365.views.ChartView,
            chartSeries = [
                {
                    name : "GOOG",
                    color : "#990000"
                },
                {
                    name : "BIDU",
                    color : "#997300"
                },
                {
                    name : "YNDX",
                    color : "#009973"
                },
                {
                    name : "BCOR",
                    color : "#007399"
                },
                {
                    name : "YHOO",
                    color : "#000099"
                },
                {
                    name : "MSFT",
                    color : "#4c0099"
                },
                {
                    name : "IACI",
                    color : "#990099"
                },
                {
                    name : "FB",
                    color : "#99004d"
                },
                {
                    name : "AAPL",
                    color : "#FFFFFF"
                },
                {
                    name : "TWTR",
                    color : "#000000"
                }
            ],
            chartConfig = {
                width: 600,
                height: 450,
                axisColor : "#FFDF1B",
                lineWidth : 1,
                backgroundColor : "#089168",
                axisWidth : 1

            };

        csvParser = new CSVParser("/data/snapshot.csv");

        csvParser.getCSVAsList(function(list){

            mktDataCollection = new MktDataCollection(BaseModel, list);
            gridView = new GridView("grid-view", mktDataCollection);
            chartView = new ChartView("chart-view", mktDataCollection, chartSeries, chartConfig);

            gridView.render();
            chartView.render();

            deltaCSVParser = new DeltaCSVParser("/data/deltas.csv");

            deltaCSVParser.on("updated", function(args){

                 mktDataCollection.updateDeltas(args[0], args[1]);
            });

            getStatsBtn = document.getElementById("get-stats");

            getStatsBtn.addEventListener("click", function(ev){

                ev.preventDefault();

                if (!isUpdating){
                    isUpdating = true;
                    deltaCSVParser.getDeltas();
                }
            });
        });
    };

    return {

        init : init
    };

}(window));