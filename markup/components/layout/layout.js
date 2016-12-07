yaModules.layout = (function () {

    function addEventListeners() {
        $('.ya-page').on('DOMMouseScroll wheel mousewheel', function(ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
            return false;
        })
    }

    return {
        init() {
            // addEventListeners();
        }
    }
}());
