function Step(step) {
    var self = this;
    self.distance = ko.observable(step.distance.text);
    self.duration = ko.observable(step.duration.text);
    self.instructions = ko.observable(step.instructions);
    self.maneuver = ko.observable(step.maneuver);
    self.icon = ko.computed(function ()
    {
        var maneuver = self.maneuver();
        if (MANEUVERS.indexOf(maneuver) < 0) {
            return null;
        }
        return "/content/images/maneuvers/" + maneuver + ".png";
    });
}

function Direction(leg) {
    var self = this;

    self.start = ko.observable(leg.start_address);
    self.end = ko.observable(leg.end_address);
    self.distance = ko.observable(leg.distance.text);
    self.duration = ko.observable(leg.duration.text);

    var steps = [];
    ko.utils.arrayForEach(leg.steps, function (item) { steps.push(new Step(item)); });

    self.steps = ko.observableArray(steps);
}

var MANEUVERS = ['turn-sharp-left', 'uturn-right', 'turn-slight-right', 'merge', 'roundabout-left', 'roundabout-right', 'uturn-left', 'turn-slight-left', 'turn-left', 'ramp-right', 'turn-right', 'fork-right', 'straight', 'fork-left', 'ferry-train', 'turn-sharp-right', 'ramp-left', 'ferry', 'keep-left', 'keep-right'];