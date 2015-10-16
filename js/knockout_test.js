/**
 * Created by abdal on 2015-08-12.
 */

ko.bindingHandlers.dialog = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};
        setTimeout(function () {
            options.close = function () {
                allBindingsAccessor().dialogVisible(false);
            };

            $(element).dialog(options);
        }, 0);
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible),
            $el = $(element),
            dialog = $el.data("uiDialog") || $el.data("dialog")

        //don't call open/close before initilization
        if (dialog) {
            $el.dialog(shouldBeOpen ? "open" : "close");
        }
    }
};

function Employee(fullname, position) {
    var self = this;
    self.fullName = ko.observable(fullname);
    self.position = ko.observable(position);
};

function Position(data) {
    var self = this;
    self.id = ko.observable(data.id);
    self.name = ko.observable(data.name);
    self.salary = ko.observable(data.salary);
    
    self.formatted = ko.computed(function(){
        return "£" + self.salary();
    });
};

function EmployeeVM() {
    var self = this;
    self.employees = ko.observableArray();
    self.Positions = ko.observableArray([]);
    self.isOpen = ko.observable(false);
    self.dialogPosition = new Position({id:'',name:'',salary:''});
    
    var PositionsJSON = {
        json: $.toJSON([{
            "id": 1,
            "name" : "No position",
            "salary" : 0
        },{
            "id": 2,
            "name" : "Web Developer",
            "salary" : 15000           
        },{
            "id": 3,
            "name" : "Manager",
            "salary" : 30000           
        }])
    };

    var data = {
        json: $.toJSON([{
            "fullName": "Richard Banks",
                "position": {
                    "id": 2
            }
        }, {
            "fullName": "Dave Grohl",
                "position": {
                    "id": 3
            }
        }, {
            "fullName": "bobby rahul",
                "position": {
                    "id": 3
            }
        }])
    };

    $.when(
        $.ajax({
            url: "/echo/json/",
            data: PositionsJSON,
            type: "POST"
        }),
        $.ajax({
            url: "/echo/json/",
            data: data,
            type: "POST"
        })
    ).done(function(positionArgs, EmployeeArgs){
        var ps = $.map(positionArgs[0], function(item){
            return new Position(item);
        });
        
        self.Positions(ps);
        
        $.each(EmployeeArgs[0], function (i, item) {
            var p = ko.utils.arrayFirst(self.Positions(), function(p){
                return p.id() == item.position.id;
            });
            
            var e = new Employee(item.fullName, p);
            self.employees.push(e);
        });
    });
    
    self.addPosition = function(){
        var newPosition = new Position({id:'',name:self.dialogPosition.name(),salary:self.dialogPosition.salary()});
        self.Positions.push(newPosition);
        self.isOpen(false);
    };
    
    self.addEmployee = function(){
        self.employees.push(new Employee("", self.Positions[0]));
    };
    
    self.open = function(){
        self.isOpen(true);
    };
}

ko.applyBindings(new EmployeeVM());

