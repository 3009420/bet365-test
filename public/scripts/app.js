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
            ChartView = win.Bet365.views.ChartView;

        csvParser = new CSVParser("/data/snapshot.csv");

        csvParser.getCSVAsList(function(list){

            mktDataCollection = new MktDataCollection(BaseModel, list);
            gridView = new GridView("grid-view", mktDataCollection);
            chartView = new ChartView("chart-view", mktDataCollection);

            gridView.render();
            chartView.render();

            deltaCSVParser = new DeltaCSVParser("/data/deltas.csv");

            deltaCSVParser.on("updated", function(data){

                 mktDataCollection.updateDeltas(data);
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