yaModules.mobileMenu = (function () {

    let $html = $('html');
    let breakpointHeader = 1100;
    let $menuModal;

    let options = {
        containerMenuClass: 'ya-mobile-menu__list',
        buttonOpenClass: 'ya-mobile-menu__open',
        directionFromLeft: 'ya-from-left',
        directionFromRight: 'ya-from-right'
    };

    function addEventListeners() {
        $('.' + options.buttonOpenClass).on('click', openMobileMenu);
        $(document).on('closing', '.remodal', closingMobileMenu);
        $(document).on('closed', '.remodal', closedMobileMenu);
        $('.ya-open-submenu').on('click', openSubmenu);
        $('.ya-mobile-menu__list-row.ya-is-back').on('click', function(ev) {
            ev.preventDefault();
            closeSubmenu();
        });
        $(window).on('resize', controlWindowWidth);
        $('[data-menu-remodal-target]').on('click', openModalFromMenu);
    }

    function createButtonBack() {
        $('.' + options.containerMenuClass).each(function () {
            let $buttonBack = $(this).find('.ya-mobile-menu__list-row.ya-is-back').first();
            let $cloneButtonBack = $buttonBack.clone(true);

            $cloneButtonBack.appendTo($(this));
        });
    }

    function moveMenu() {
        $('.ya-header__mobile').appendTo($('body'));
        $('.' + options.containerMenuClass).each(function (i) {
            let $menu = $(this);
            let $buttonOpen = $menu.parents('.ya-mobile-menu').first().find('.' + options.buttonOpenClass);
            let direction = $menu.hasClass(options.directionFromLeft) ? options.directionFromLeft : options.directionFromRight;

            $menu.addClass('menu-num-' + i).addClass(direction);
            $buttonOpen.data('current-menu-num', i).data('direction', direction);
            $menu.appendTo($('body')).addClass('ya-mobile-menu-ready');
        });
    }

    function openMobileMenu(ev) {
        ev.preventDefault();

        let $buttonOpen = $(this);
        let currentMenuNum = $buttonOpen.data('current-menu-num');
        let direction = $buttonOpen.data('direction');

        $menuModal = $('[data-remodal-id=modal-mobile-menu]').remodal();
        $html.addClass('ya-mobile-menu-open ' + direction);
        $('.menu-num-' + currentMenuNum).addClass('ya-menu-open');
        $menuModal.open();
    }

    function closingMobileMenu() {
        if (!$menuModal) return;

        $html.addClass('ya-mobile-menu-closing');
        closeButtonBack();
        $html.removeClass('ya-mobile-menu-open ' + options.directionFromLeft + ' ' + options.directionFromRight);
        $('.' + options.containerMenuClass + '.ya-menu-open').removeClass('ya-menu-open');
    }

    function closedMobileMenu() {
        if (!$menuModal) return;

        $html.removeClass('ya-mobile-menu-closing');
        $menuModal = undefined;
        closeSubmenu();
    }

    function openSubmenu(ev) {
        ev.preventDefault();

        let $submenu = $(this).parents('.ya-mobile-menu__list-li').first().find('.ya-mobile-menu__list-ul').first();
        let $mainUl = $submenu.parents('.ya-mobile-menu__list-ul').first();
        let $buttonBack = $mainUl.parents('.' + options.containerMenuClass).children('.ya-is-back').first();

        $mainUl.addClass('ya-no-overflow');
        $submenu.css('top', $mainUl.scrollTop()).addClass('ya-is-open');
        $buttonBack.addClass('ya-is-open');
    }

    function closeSubmenu() {
        closeButtonBack();
        $('.ya-mobile-menu__list-ul.ya-no-overflow').removeClass('ya-no-overflow');
        $('.ya-mobile-menu__list-ul.ya-is-open').removeClass('ya-is-open');
    }

    function closeButtonBack() {
        $('.ya-is-back.ya-is-open').removeClass('ya-is-open');
    }

    function controlWindowWidth() {
        if (!$menuModal) return;

        if ($(window).width() >= breakpointHeader) {
            $menuModal.close();
        }
    }

    function openModalFromMenu(ev) {
        ev.preventDefault();
        if (!$menuModal || $menuModal.getState() !== 'opened') return;

        let modalId = $(this).data('menu-remodal-target');
        let $currentModal = $('[data-remodal-id=' + modalId + ']').remodal();

        $menuModal ? $menuModal.close() : '';
        closedMobileMenu();
        $currentModal.open();
    }

    return {
        init() {
            if ($('.ya-mobile-menu').length) {
                createButtonBack();
                moveMenu();
                addEventListeners();
            }
        }
    }
}());
