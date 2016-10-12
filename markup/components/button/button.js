yaModules.button = (function () {

    function addEventListeners() {
        $('a').on('mouseleave', {selector: 'a'}, triggerBlur);
        $('button').on('mouseleave', {selector: 'button'}, triggerBlur);
    }

    function triggerBlur(ev) {
        $(ev.target).closest(ev.data.selector).trigger('blur');
    }

    return {
        init() {
            if ($('a, button').length) {
                addEventListeners();
            }
        }
    }
}());
