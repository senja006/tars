yaModules.yaChangeView = (function () {

    let $buttonsChangeView = $('.ya-change-view__button');

    function addEventListeners() {
        $buttonsChangeView.on('click', changeView);
    }

    function changeView() {
        let $button = $(this).closest('.ya-change-view__button');
        let $group = $button.parents('.ya-change-view__group');
        let classesView = $group.data('classes-view');
        let classView = $button.data('view');
        let $container = $($button.data('container'));

        $group.find('.ya-active').removeClass('ya-active');
        $button.addClass('ya-active');
        $container.removeClass(classesView);
        $container.addClass(classView);
    }

    function getViewClasses() {
        $('.ya-change-view__group').each(function() {
            let $group = $(this);
            let classesView = [];
            $group.find('.ya-change-view__button').each(function() {
                classesView.push($(this).data('view'));
            });
            $group.data('classes-view', classesView.join(' '));
        });
    }

    return {
        init() {
            if ($buttonsChangeView.length) {
                getViewClasses();
                addEventListeners();
            }
        }
    }
}());
