yaModules.tabs = (function () {

    let $tabs = $('[data-tabs-container]');

    function createTabs() {
        $tabs.each(function() {
            new YaTabs($(this));
        });
    }

    return {
        init() {
            if ($tabs.length) {
                createTabs();
            }
        }
    }
}());
