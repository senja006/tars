/**
 * Автор Яркевич Сергей, senja999@mail.ru
 */

class Parallax {

    /**
     *
     * @param options - object
     * @param element - jQueryObject
     * @param ratio - процент смещения. От 0 до 1
     */
    constructor(options) {
        let self = this;

        self.$element = options.element;
        self.ratio = options.ratio;
        self.$window = $(window);
        self.window = window;
        self.$document = $(document);

        self.$element.css({
            transform: 'translate3d(0, 0, 0)'
        });

        self._getParent(self.$element.parent());
        self._controlParallax();
        self._addEventListeners()
    }

    /**
     * Обработчики событий
     * @private
     */
    _addEventListeners() {
        let self = this;

        self.$window.on('resize', () => self._controlParallax());
        self.$document.on('scroll', () => self._setParallax());
    }

    /**
     * Получаем родителя, относительно которого спозиционирован элемент
     * @private
     */
    _getParent($parent) {
        let position = getComputedStyle($parent[0]).position;

        if (position != 'static') {
            this.$parent = $parent;
        } else {
            this._getParent($parent.parent());
        }
    }

    _controlParallax() {
        let self = this;

        self._getOptions();
        self._setSizeElement();
        self._setParallax();
    }

    /**
     * Получение всех настроек
     * @private
     */
    _getOptions() {
        let self = this;

        self.windowHeight = self.$window.outerHeight();
        self.windowScrollTop = self.window.pageYOffset;
        self.parentHeight = self.$parent.outerHeight();
        self.parentPositionTop = self.$parent.offset().top;
        self.elementHeight = self.windowHeight * self.ratio + self.parentHeight;
    }

    /**
     * Установка размера элемента
     * @private
     */
    _setSizeElement() {
        let self = this;

        self.$element.css({
            height: self.elementHeight
        });
    }

    /**
     * Установка сдвига
     * @private
     */
    _setParallax() {
        let self = this;
        self.windowScrollTop = self.window.pageYOffset;

        if (self._definitionVisibilityParent()) {
            let scrollTopInVisibility = self.windowScrollTop - (self.parentPositionTop - self.windowHeight);
            let translateY = (0 - self.windowHeight * self.ratio) + scrollTopInVisibility * self.ratio;

            self.$element[0].style.transform = 'translateY(' + translateY + 'px)';
        }
    }

    /**
     * Определение нахождения родителя в области видимости
     * @private
     */
    _definitionVisibilityParent() {
        let self = this;

        if (self.parentPositionTop < self.windowScrollTop + self.windowHeight && self.parentPositionTop + self.windowHeight > self.windowScrollTop) {
            return true;
        } else {
            return false;
        }
    }
}
