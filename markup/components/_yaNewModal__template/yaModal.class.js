class YaModal {

    constructor(modals) {
        let self = this;
        let $body = $('body');

        self.modals = {
            all: modals, // все окна
            open: [], // окрытые окна
            openNotToggle: [] // окна, которые не закрываются при открытии других окон
        };

        self.attrs = {
            duration: 'data-ya-modal-duration', // длительность анимации, для .ya-modal-wrapper
            open: 'data-ya-modal-open', // атрибут для открытия окна, для кнопки
            close: 'data-ya-modal-close', // атрибут закрытия окон, для кнопки
            modifier: 'data-ya-modal-modifier', // модификаторы для body
            notToggle: 'data-ya-modal-not-toggle', // атрибут со значением true для окна, которое не нужно скрывать при открытии других окон, для .ya-modal-wrapper
            overlayNone: 'data-ya-modal-overlay-none', // если при открытии данного окна не нужен overlay со значением true
        };

        self.classes = {
            wrapper: 'ya-modal-wrapper', // обертка для окна
            modal: 'ya-modal', // окно
            active: 'ya-modal-active', // класс активности
            modalOpen: 'ya-modal-open', // для body
            elementFixed: 'ya-fixed', // для управления фиксированными элементами
            modalBack: 'ya-modal-back', // для фиксированного окна при открытии еще одного
        };

        self.defaultOptions = {
            duration: 300, // длительность анимации
        };

        self.timerOpenModal = undefined; // таймер при переключении окон
        self.isOpening = false; // флаг открытия или закрытия окон
        self.widthScrollBar = self._getWidthScrollbar(); // определение ширины скролл бара

        // перенос всех окон в body
        $body.append(self.modals.all);

        // создание подложки
        self.$overlay = $('<div class="ya-modal-overlay">');
        $body.append(self.$overlay);

        // класс готовности окон
        $body.addClass('ya-modal-ready');

        self._addEventListener();
    }

    // подписка на события
    _addEventListener() {
        let self = this;
        let $html = $('html');

        $html.on('click', '[' + self.attrs.open + ']', self._openModal.bind(self));
        $html.on('click', '[' + self.attrs.close + ']', {event: 'click'}, self._closeModal.bind(self));
        $html.on('click', '.' + self.classes.wrapper, {event: 'click'}, self._closeModal.bind(self));
        $html.on('click', '.' + self.classes.modal, self._clickModal.bind(self));
    }

    // открытие окна
    _openModal(ev) {
        ev.preventDefault();

        let self = this;
        let selector = $(ev.target).closest('[' + self.attrs.open + ']').attr(self.attrs.open);
        let $modalWrapper = self.modals.all.filter(selector);
        let $modal = $modalWrapper.find('.ya-modal');

        if(self.isOpening) return;

        self.isOpening = true;

        let durationAnimationModal = $modalWrapper.attr(self.attrs.duration) || self.defaultOptions.duration;
        let durationAnimationOverlay = durationAnimationModal;
        let delayShowModal = 0;
        let isNotToggle = $modalWrapper.attr(self.attrs.notToggle);

        // управление overlay
        if($modalWrapper.attr(self.attrs.overlayNone)) {
            if(self.modals.open.length) {
                durationAnimationOverlay = self.modals.open[0].attr(self.attrs.duration);
            }
            self._setTransitionDurationAnimation(self.$overlay, durationAnimationOverlay);
            self.$overlay.removeClass(self.classes.active);
        }

        // фиксированное окно на задний план
        if(!$modalWrapper.attr(self.attrs.notToggle) && self.modals.openNotToggle.length) {
            self.modals.openNotToggle[0].addClass(self.classes.modalBack);
        }

        // если уже есть открытые окна
        if(self.modals.open.length) {
            // определение времени задержки
            delayShowModal = self._getMaxDurationAnimationOpenModal();

            // закрытие открытых окон
            self._closeModal();
        }else{
            $('body').css('padding-right', self.widthScrollBar);
            $('.' + self.classes.elementFixed).css('padding-right', self.widthScrollBar);
            $('html').addClass(self.classes.modalOpen);
        }

        // задержка открытия окна
        self.timerOpenModal = setTimeout(() => {
            // установка модификаторов
            self._setModifiers($modalWrapper, 'opening');

            // добавление открытого окна в массив
            if(isNotToggle) {
                self.modals.openNotToggle.push($modalWrapper);
            }else{
                self.modals.open.push($modalWrapper);
            }

            // управление overlay
            if(!$modalWrapper.attr(self.attrs.overlayNone)) {
                self._setTransitionDurationAnimation(self.$overlay, durationAnimationModal);
                self.$overlay.addClass(self.classes.active);
            }

            // присвоение активного класса
            self._setTransitionDurationAnimation($modal, durationAnimationModal);
            $modalWrapper.addClass(self.classes.active);

        }, delayShowModal);

        setTimeout(() => {
            // переустановка модификаторов
            self._setModifiers($modalWrapper, 'opened');
            self._removeModifiers($modalWrapper, 'opening');

            self.isOpening = false;
        }, durationAnimationModal);
    }

    // закрытие окон
    _closeModal(ev) {
        let self = this;

        let durationAnimationModal = self._getMaxDurationAnimationOpenModal();
        let $modalWrapper = undefined;
        let $modal = undefined;

        if(ev && $(ev.target).closest('[' + self.attrs.notToggle + ']').length) {
            $modalWrapper = self.modals.openNotToggle[0];
            durationAnimationModal = $modalWrapper.attr(self.attrs.duration);

            // очистка массива
            self.modals.openNotToggle.splice(0, self.modals.openNotToggle.length);
        }else{
            $modalWrapper = self.modals.open[0];
        }

        $modal = $modalWrapper.find('.ya-modal');

        self._setTransitionDurationAnimation(self.$overlay, durationAnimationModal);

        // проверка необходимости overlay
        if(self.modals.openNotToggle.length) {
            if(self.modals.openNotToggle[0].attr(self.attrs.overlayNone)) {
                self.$overlay.removeClass(self.classes.active);
            }else{
                self.$overlay.addClass(self.classes.active);
            }
        }

        // удаление активного класса
        $modalWrapper.removeClass(self.classes.active);

        // установка модификаторов
        self._setModifiers($modalWrapper, 'closing');
        self._removeModifiers($modalWrapper, 'opened');

        setTimeout(() => {

            // фиксированное окно на передний план
            if(self.modals.openNotToggle.length) {
                self.modals.openNotToggle[0].removeClass(self.classes.modalBack);
            }

            //self._setModifiers($modalWrapper, 'closed');
            self._removeModifiers($modalWrapper, 'closing');
        }, durationAnimationModal);

        // очистка массива
        self.modals.open.splice(0, self.modals.open.length);

        if(!self.isOpening && !self.modals.openNotToggle.length) {
            self.$overlay.removeClass(self.classes.active);

            setTimeout(() => {
                $('body').css('padding-right', 0);
                $('.' + self.classes.elementFixed).css('padding-right', 0);
                $('html').removeClass(self.classes.modalOpen);
            }, durationAnimationModal);
        }
    }

    // отмена всплытия события при клике внутри окна
    _clickModal(ev) {
        if($(ev.target).closest('.' + this.classes.modal)) ev.stopPropagation();
    }

    // установка длительности анимации
    _setTransitionDurationAnimation(el, time) {
        el.css({
            'transition-duration': time + 'ms',
            '-webkit-transition-duration': time + 'ms'
        });
    }

    _getMaxDurationAnimationOpenModal() {
        let self = this;
        let duration = 0;

        self.modals.open.forEach(function(modal) {
            let currentDuration = +modal.attr(self.attrs.duration) || self.defaultOptions.duration;
            if(currentDuration > duration) {
                duration = currentDuration;
            }
        });

        return duration;
    }

    _getWidthScrollbar() {
        var outer = document.createElement('div');
        var inner = document.createElement('div');
        var widthNoScroll;
        var widthWithScroll;

        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        document.body.appendChild(outer);

        widthNoScroll = outer.offsetWidth;

        // Force scrollbars
        outer.style.overflow = 'scroll';

        // Add inner div
        inner.style.width = '100%';
        outer.appendChild(inner);

        widthWithScroll = inner.offsetWidth;

        // Remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }

    _setModifiers(modal, str) {
        let self = this;
        let modifiers = self._getModifiers(modal, str);

        if(modifiers) {
            $('body').addClass(modifiers);
        }
    }

    _removeModifiers(modal, str) {
        let self = this;
        let modifiers = self._getModifiers(modal, str);

        if(modifiers) {
            $('body').removeClass(modifiers);
        }
    }

    _getModifiers(modal, str) {
        let self = this;
        let modifiers = modal.attr(self.attrs.modifier);

        if(modifiers) {
            modifiers = modifiers.split(' ');
            let strClasses = '';
            modifiers.forEach(function(modifier) {
                strClasses += ' ' + modifier + '-' + str;
            });

            return strClasses;
        }

        return false;
    }

}
