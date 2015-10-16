/**
 * Created by abdal on 2015-10-16.
 */

var myns = {};
myns.DisplayFields = function(jsondata) {
    var viewModel = {
        fields: ko.observableArray(jsondata),
        pageSize: ko.observable(10),
        pageIndex: ko.observable(0),
        previousPage: function() {
            this.pageIndex(this.pageIndex() - 1);
        },
        nextPage: function() {
            this.pageIndex(this.pageIndex() + 1);
        }
    };

    viewModel.maxPageIndex = ko.dependentObservable(function() {
        return Math.ceil(this.fields().length / this.pageSize()) - 1;
    }, viewModel);


    viewModel.pagedRows = ko.dependentObservable(function() {
        var size = this.pageSize();
        var start = this.pageIndex() * size;
        return this.fields.slice(start, start + size);
    }, viewModel);

    ko.applyBindings(viewModel);
};

$(function() {
    var data = [];
    for (var i = 0; i < 100; i++) {
        data.push({
            FieldId: i,
            Type: "Type" + i,
            Name: "Name" + i,
            Description: "Description" + i
        })
    }

    myns.DisplayFields(data);

});
