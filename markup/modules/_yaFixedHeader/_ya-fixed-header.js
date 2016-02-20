yaModules.yaFixedHeader = (function() {

    let $fixedHeader = undefined;
    let $containerFixedHeader = $('.ya-header__fixed-container');

    /**
     * Добавление обработчиков
     */
    function addEventListeners() {
        $(window).on('scroll load', controlHeader);
    }

    function controlHeader() {
        let scrollLeft = $(window).scrollLeft();

        setPositionHeader(scrollLeft);
    }

    /**
     * Установка позиции фиксированного блока при горизонтальной прокрутке страницы
     */
    function setPositionHeader(scrollLeft) {
        if(scrollLeft < 0) return;
        if(!$fixedHeader) $fixedHeader = $('.ya-header__fixed');

        $fixedHeader.each(function() {
            $(this).css('left', -scrollLeft);
        });
    }

    function setHeightContainer() {
        let height = $containerFixedHeader.outerHeight();

        $containerFixedHeader.css('height', height);
    }

    return {
        init() {
            if($('.ya-header__fixed').length) {
                // setHeightContainer();
                addEventListeners();
                setPositionHeader();
            }
        }
    }

})();

