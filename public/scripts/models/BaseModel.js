window.Bet365 = window.Bet365 || {};
window.Bet365.models = window.Bet365.models || {};

window.Bet365.models.BaseModel = (function (win) {

    //constructor function
    var BaseModel = function (data) {

        this.properties = {};
        this.setAll(data);
    };

    BaseModel.prototype.get = function (propertyName) {

        return this.properties[propertyName];
    };

    BaseModel.prototype.set = function (propertyName, value) {

        this.properties[propertyName] = value;
    };

    BaseModel.prototype.setAll = function (data) {

        for (var item in data) {

            //throw error if we don't have unique property names
            if (this.properties.hasOwnProperty(item)) {

                throw new Error("A model must has unique property names");
            } else {
                this.properties["" + item.replace("\r", "")] = data["" + item];
            }
        }
    };

    return BaseModel;

})(this);