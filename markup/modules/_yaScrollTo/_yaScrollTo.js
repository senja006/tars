yaModules.yaScrollTo = (function () {

    let optionsAttrData = {
        scrollTarget: 'ya-scroll-target', // Блок, который нужно прокрутить. По умолчанию html
        duration: 'ya-scroll-duration', // длительность скрола
        scrollTo: 'ya-scroll-to', // К какому блоку скролить. Если вверх страницы, то не указывать
    };
    let $buttonScroll = $('[data-' + optionsAttrData.scrollTo + ']');
    let offset = $('[data-ya-scroll-to-offset]').outerHeight();

    function addEventListeners() {
        $buttonScroll.on('click', controlScrollTo);
    }

    function controlScrollTo(ev) {
        ev.preventDefault();

        let $button = $(this).closest('[data-' + optionsAttrData.scrollTo + ']');
        let top = 0;
        let $scrollTarget = $($button.parents($button.data(optionsAttrData.scrollTarget))) || $('html, body');
        let duration = $button.data(optionsAttrData.duration) || 1000;

        if($button.attr(optionsAttrData.scrollTo) != 'top') {
            let $currentBlock = $($button.data(optionsAttrData.scrollTo));
            top = $currentBlock.offset().top;

            if(offset) top = top + offset;
        }

        $scrollTarget.animate({
            scrollTop: top
        }, duration);
    }

    return {
        init() {
            if ($buttonScroll.length) {
                addEventListeners();
            }
        }
    }
}());
