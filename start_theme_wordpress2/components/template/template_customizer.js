(function($, api) {
    if ('undefined' !== typeof window.wp || api || api.selectiveRefresh) {
        setTimeout(function() {
            api.selectiveRefresh.bind('widget-updated', function(placement) {

            });
        }, 0);
    }
})(jQuery, wp.customize);
