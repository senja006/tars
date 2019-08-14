yaModules.yaSticky = (function () {

    let $stickyBlock = $('.ya-sticky');

    function addEventListeners() {
        $(document).on('scroll', moveStickyBlock);
        $(window).on('resize', function() {
            getPositionStickyBlock();
            initSticky();
            recalcSticky();
        });
        $('.ya-sticky').on("sticky_kit:bottom", function(e) {
            $(this).addClass('ya-is-bottom');
        });
        $('.ya-sticky').on("sticky_kit:unbottom", function(e) {
            $(this).removeClass('ya-is-bottom');
        });
    }

    function initSticky() {
        $('.ya-sticky').each(function() {
            let $sticky = $(this);
            let widthToInit = $sticky.data('width-to-init');
            let $hiddenContainer = $sticky.data('hidden-container') ? $sticky.parents($sticky.data('hidden-container')) : false;

            if($hiddenContainer && $hiddenContainer.css('display') === 'none') return;

            if($sticky.hasClass('ya-is-init') || $(window).outerWidth() < widthToInit) return;

            $sticky.addClass('ya-is-init');

            let offsetTop = $sticky.data('offset-top');

            if($('.ya-header__fixed').length) {
                offsetTop += $('.ya-header__fixed').outerHeight();
            }

            $sticky.stick_in_parent({
                'offset_top': offsetTop,
            });
        });
    }

    function moveStickyBlock() {
        let scrollLeft = $(document).scrollLeft();
        $('.ya-sticky').each(function() {
            let $block = $(this);
            let defaultPosition = $block.data('position');
            let position = defaultPosition - scrollLeft;
            $block.css('left', position);
        });
    }

    function getPositionStickyBlock() {
        $('.ya-sticky').each(function() {
            let $block = $(this);
            let position = $block.parent().offset().left;
            $block.data('position', position);
        });
        moveStickyBlock();
    }

    function detachSticky() {
        $('.ya-sticky').trigger("sticky_kit:detach").removeClass('ya-is-init');
        $('.ya-sticky').removeClass('ya-is-init');
    }

    function recalcSticky() {
        setTimeout(function() {
            getPositionStickyBlock();
            $('.ya-sticky').removeClass('ya-is-bottom');
            $(document.body).trigger("sticky_kit:recalc");
        }, 10);
    }

    return {
        init() {
            if ($stickyBlock.length) {
                getPositionStickyBlock();
                initSticky();
                addEventListeners();
            }
        },
        customInit() {
            getPositionStickyBlock();
            initSticky();
        },
        detach() {
            detachSticky();
        },
        recalc() {
            recalcSticky();
        }
    }
}());
