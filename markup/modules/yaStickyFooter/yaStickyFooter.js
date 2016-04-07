yaModules.yaStickyFooter = (function () {

    let $page = $('.ya-page');
    let heightHeader = $('.ya-header').outerHeight();
    let heightFooter = $('.ya-footer').outerHeight();
    let $content = $('.ya-content');

    function addEventListeners() {
        $(window).on('resize', setMinHeightContent);
    }

    function checkSupportMinHeight() {
        let heightPage = $page.outerHeight();
        let offsetTopFooter = $('.ya-footer').offset().top;

        if (offsetTopFooter + heightFooter < heightPage) {
            return false;
        }

        return true;
    }

    function setMinHeightContent() {
        let heightWindow = $(window).height();
        let headerMarginBottom = $('.ya-header').css('margin-bottom').replace(/[^-\d.]/g, '');
        let height = heightWindow - heightHeader - heightFooter - headerMarginBottom;

        $content.css('min-height', height);
    }

    return {
        init() {
            if ($('.ya-footer').offset() && !checkSupportMinHeight()) {
                setMinHeightContent();
                addEventListeners();
            }
        }
    }
}());
