yaModules.yaWow = (function () {

    let classWow = 'wow';

    function initPlaginWow() {
        new WOW().init();
    }

    return {
        init() {
            if ($('.' + classWow).length) {
                initPlaginWow();
            }
        }
    }
}());
