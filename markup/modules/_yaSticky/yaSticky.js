yaModules.yaSticky = (function () {

    let $stickyBlock = $('.ya-sticky');

    function addEventListeners() {
        $(document).on('scroll', moveStickyBlock);
        $(window).on('resize', getPositionStickyBlock);
        $stickyBlock.on("sticky_kit:bottom", function(e) {
            $(this).addClass('ya-is-bottom');
        });
        $stickyBlock.on("sticky_kit:unbottom", function(e) {
            $(this).removeClass('ya-is-bottom');
        });
    }

    function initSticky() {
        let offset = 10;

        if($('.ya-header__fixed').length) {
            offset += $('.ya-header__fixed').outerHeight();
        }

        $stickyBlock.stick_in_parent({
            'offset_top': offset
        });
    }

    function moveStickyBlock() {
        let scrollLeft = $(document).scrollLeft();
        $stickyBlock.each(function() {
            let $block = $(this);
            let defaultPosition = $block.data('position');
            let position = defaultPosition - scrollLeft;
            $block.css('left', position);
        });
    }

    function getPositionStickyBlock() {
        $stickyBlock.each(function() {
            let $block = $(this);
            let position = $block.parent().offset().left;
            $block.data('position', position);
        });
        moveStickyBlock();
    }

    return {
        init() {
            if ($stickyBlock.length) {
                getPositionStickyBlock();
                initSticky();
                addEventListeners();
            }
        }
    }
}());
