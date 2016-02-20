yaModules.yaStickyFooter = (function () {

    let $page = $('.ya-page');
    let heightHeader = $('.ya-header').outerHeight();
    let heightFooter = $('.ya-footer').outerHeight();
    let offsetTopFooter = $('.ya-footer').offset().top;
    let $content = $('.ya-content');

    function addEventListeners() {
        $(window).on('resize', setMinHeightContent);
    }

    function checkSupportMinHeight() {
        let heightPage = $page.outerHeight();

        if (offsetTopFooter + heightFooter < heightPage) {
            return false;
        }

        return true;
    }

    function setMinHeightContent() {
        let heightWindow = $(window).height();
        let height = heightWindow - heightHeader - heightFooter;

        $content.css('min-height', height);
    }

    return {
        init() {
            if (!checkSupportMinHeight()) {
                setMinHeightContent();
                addEventListeners();
            }
        }
    }
}());
