class YaTabs {

    constructor(container) {
        let self = this;

        if(typeof container == 'string') {
            self.container = document.getElementById(container.substring(1));
        }else{
            self.container = container;
        }

        self.classes = {
            ready: 'ya-tabs-ready',
            button: 'ya-tabs__button',
            tab: 'ya-tabs__list-li',
            active: 'ya-tabs-active'
        };

        self.$container = $(container);
        self.$buttons = self.$container.find('.' + self.classes.button);
        self.$tabs = self.$container.find('.' + self.classes.tab);

        // установка высоты контейнера
        let maxHeight = 0;
        self.$tabs.each(function() {
            if($(this).outerHeight() > maxHeight) {
                maxHeight = $(this).outerHeight();
            }
        });
        //self.$container.find('.ya-tabs__list-ul').height(maxHeight);

        // подписка на события
        self._addEventListener();

        // класс готовности
        self.$container.addClass(self.classes.ready);

        // показ необходимого таба
        let $currentTabButton = self.$buttons.filter('.' + self.classes.active);
        if($currentTabButton.length) {
            $currentTabButton.click();
        }else{
            self.$buttons.first().click();
        }
    }

    _addEventListener() {
        let self = this;

        self.$buttons.on('click', self._showTab.bind(self));
    }

    _showTab(ev) {
        let self = this;

        let $button = $(ev.target).closest('.' + self.classes.button);
        let num = self.$buttons.index($button);

        // активный класс контенту
        self.$tabs.removeClass(self.classes.active);
        self.$tabs.eq(num).addClass(self.classes.active);

        // активный класс кнопке
        self.$buttons.removeClass(self.classes.active);
        $button.addClass(self.classes.active);

        $('body').trigger('ya-tabs-changed');
    }
}
