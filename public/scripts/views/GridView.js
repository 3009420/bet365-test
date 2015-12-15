window.Bet365 = window.Bet365 || {};
window.Bet365.views = window.Bet365.views || {};

window.Bet365.views.GridView = (function (win) {

    var BaseView = window.Bet365.views.BaseView;

    var GridView = function (rootElementId, collection) {

        var self = this;

        BaseView.call(this, rootElementId);

        this.collection = collection;

        this.collection.on("updatedModel", function (args) {

            self.updateDeltasInDOM(args[0], args[1], args[2]);
        });
    };


    GridView.prototype = Object.create(BaseView.prototype);

    GridView.prototype.updateDeltasInDOM = function (index, fieldName, value) {

        var tableCell = document.getElementById(fieldName.replace(" ", "-") + "-" + index);
        tableCell.textContent = value;
        tableCell.setAttribute("class", tableCell.getAttribute("class") + " updated");
        setTimeout(function(){
            tableCell.setAttribute("class", tableCell.getAttribute("class").replace(" updated", ""));
        }, 666)
    };

    GridView.prototype.render = function () {

        var tableCell,
            tableRow,
            headingCell,
            headingData = ["Name", "Company Name", "Price", "Change", "Chg %", "Mkt Cap"],
            headingDataLen = headingData.length,
            table = document.createElement("table"),
            thead = document.createElement("thead"),
            tbody = document.createElement("tbody"),
            tableHeadingRow = document.createElement("tr");

        for (var i = 0; i < headingDataLen; i++) {

            headingCell = document.createElement("th");
            tableHeadingRow.appendChild(headingCell);
            headingCell.textContent = headingData[i];
        }

        thead.appendChild(tableHeadingRow);
        table.appendChild(thead);

        this.collection.forEach(function (model, index) {

            tableRow = document.createElement("tr");

            for (var i = 0; i < headingDataLen; i++) {

                tableCell = document.createElement("td");
                tableCell.textContent = model.get(headingData[i]);
                tableCell.setAttribute("id", headingData[i].replace(" ", "-") + "-" + index);
                tableRow.appendChild(tableCell);
            }
            if (index % 2 == 0) {
                tableRow.setAttribute("class", "odd");
            }
            tbody.appendChild(tableRow);
        });

        table.appendChild(tbody);

        this.rootElement.appendChild(table);
    };

    return GridView;

})(this);