mslc.define('client/extends/nanobar', ['lib/jQuery'], function($) {
    return {
        extend: function() {
            var Nanobar = function(element, options) {

                this.$element = element;
                this.bar = element.find('.bar');
                this.options = options;

                this.progress = 0;

                this.init();
            };

            Nanobar.prototype.init = function() {
                this.set(this.options.value);
            };

            Nanobar.prototype.reinit = function() {
                this.stop();
                this.set(this.options.value);
                this.$element.stop(true, true);
            };

            Nanobar.prototype.updateOptions = function(newOptions) {
                if (typeof newOptions === 'object') {
                    $.extend(this.options, newOptions);
                }
            };

            Nanobar.prototype.start = function() {
                var self = this;

                this.set(0);

                this.bar.removeClass('error');
                this.$element.show();

                this.timer = window.setInterval(function() {
                    if (self.progress >= 100) {
                        self.stop();
                    }

                    self.step();
                }, this.options.tickDelay);
            };

            Nanobar.prototype.stop = function() {
                window.clearInterval(this.timer);
                this.$element.delay(500).fadeOut(1000);
            };

            Nanobar.prototype.step = function() {
                if (typeof this.options.easingFunc !== 'function') {
                    this.options.easingFunc = $.fn.nanobar.defaults.easingFunc;
                }

                this.inc(Math.random() * this.options.easingFunc.call(this));
            };

            Nanobar.prototype.inc = function(value) {
                if (typeof value === 'undefined') {
                    value = Math.random() * 2;
                }

                this.set(this.progress + value);
            };

            Nanobar.prototype.set = function(value) {
                if (value > 100) {
                    value = 100;
                }
                if (value < 0) {
                    value = 0;
                }

                this.progress = value;

                this.bar.width(value + '%');
            };

            Nanobar.prototype.done = function() {
                this.inc((100 - this.progress) * Math.random());
                this.set(100);
            };

            Nanobar.prototype.error = function() {
                this.stop();
                this.bar.addClass('error');
            };

            $.fn.nanobar = function(options, argument) {
                var opts = $.extend({}, $.fn.nanobar.defaults, options);

                return this.each(function() {
                    var instance = $.data(this, '_nanobar');

                    if (!instance) {
                        instance = $.data(this, '_nanobar', new Nanobar($(this), opts));
                    }

                    if (typeof options === 'string') {
                        instance[options](argument);
                    }
                });
            };

            $.fn.nanobar.defaults = {
                value: 0,
                tickDelay: 300,
                easingFunc: function() {
                    var multiplier = 5 * (1 - this.progress / 90);
                    return multiplier > 0 ? multiplier : 0.001;
                }
            };
        }
    };
});
