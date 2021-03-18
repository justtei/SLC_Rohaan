mslc.define('admin/models/ko/officeHours', ['lib/ko', 'lib/moment', 'admin/config', 'admin/text', 'admin/util'],
    function(ko, moment, config, text, util) {
        'use strict';

        function OfficeHours(data) {
            var self = this;

            this.id = data.id;
            this.startDay = ko.observable(data.startDay);
            this.startDays = data.startDays;
            this.endDay = ko.observable(data.endDay);
            this.endDays = data.endDays;
            this.defaultTime = moment().startOf('day');
            this.timeFormat = config.setting('momentJsTimeFormat');
            this.startTime = ko.observable(util.moment(data.startTime || self.defaultTime).format(self.timeFormat));
            this.endTime = ko.observable(util.moment(data.endTime || self.defaultTime).format(self.timeFormat));
            this.note = ko.observable(data.note);

            this.applyValidationRules = function() {
                self.startDay.extend({
                    weekRange: {
                        params: self.endDay,
                        message: util.stringFormat(text.message('weekRangeErrorMessage'), 
                            text.message('startDayLabel'),
                            text.message('endDayLabel'))
                    }
                });

                self.note.extend({
                    maxLength: {
                        params: config.setting('officeHoursNoteMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'), 
                            text.message('noteLabel'),
                            config.setting('officeHoursNoteMaxLength'))
                    }
                });
            };

            this.getData = function() {
                var result = {
                    id: self.id,
                    startDay: self.startDay(),
                    endDay: self.endDay(),
                    startTime: self.startTime(),
                    endTime: self.endTime(),
                    note: self.note()
                };

                return result;
            };

            self.applyValidationRules();
        }

        return OfficeHours;
    });