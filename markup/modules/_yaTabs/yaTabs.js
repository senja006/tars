yaModules.yaTabs = (function () {

    let $tabs = $('.ya-tabs');

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
