mslc.define('windowInject', [], function() {
    return function(name) {
        if (window[name]) {
            return window[name];
        } else {
            if (name === 'google') {
                console.error('Google maps aren\'t loaded.');
                return {};
            }
            throw new Error('Can\'t inject lib ' + name);
        }
    };
});

mslc.define('lib/ko', ['windowInject'], function(inject) {
    return inject('ko');
});

mslc.define('lib/jQuery', ['windowInject'], function(inject) {
    return inject('jQuery');
});

mslc.define('lib/moment', ['windowInject'], function(inject) {
    return inject('moment');
});

mslc.define('lib/gm', ['windowInject'], function(inject) {
    return inject("google").maps;
});