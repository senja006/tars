class YaTabs {

    constructor(container) {
        let self = this;

        if(typeof container == 'string') {
            self.container = document.getElementById(container.substring(1));
        }else{
            self.container = container;
        }

        self.selectors = {
            ready: 'ya-tabs-ready',
            button: '[data-tabs-button]',
            tab: '[data-tabs-content]',
            active: 'ya-tabs-active'
        };

        self.$container = $(container);
        self.$buttons = self.$container.find(self.selectors.button);
        self.$tabs = self.$container.find(self.selectors.tab);

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
        self.$container.addClass(self.selectors.ready);

        // показ необходимого таба
        let $currentTabButton = self.$buttons.filter(self.selectors.active);
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
        ev.preventDefault();
        let self = this;

        let $button = $(ev.target).closest(self.selectors.button);
        let num = self.$buttons.index($button);

        // активный класс контенту
        self.$tabs.removeClass(self.selectors.active);
        self.$tabs.eq(num).addClass(self.selectors.active);

        // активный класс кнопке
        self.$buttons.removeClass(self.selectors.active);
        $button.addClass(self.selectors.active);

        $('body').trigger('ya-tabs-changed');
    }
}
