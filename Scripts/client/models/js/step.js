mslc.define('client/models/js/step', ['lib/ko'], function(ko) {
    'use strict';

    var maneuvers = ['turn-sharp-left', 'uturn-right', 'turn-slight-right', 'merge', 'roundabout-left',
        'roundabout-right', 'uturn-left', 'turn-slight-left', 'turn-left', 'ramp-right', 'turn-right',
        'fork-right', 'straight', 'fork-left', 'ferry-train', 'turn-sharp-right', 'ramp-left', 'ferry',
        'keep-left', 'keep-right'];

    function resolveIcon(maneuver) {
        if (!maneuver
            || maneuvers.indexOf(maneuver) < 0) {
            return null;
        }

        return "/content/images/maneuvers/" + maneuver + ".png";
    }

    function Step(step) {
        this.distance = step.distance.text;
        this.duration = step.duration.text;
        this.instructions = step.instructions;
        this.maneuver = step.maneuver;
        this.icon = resolveIcon(this.maneuver);

        return this;
    }

    return Step;
});