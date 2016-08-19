class YaSwiper {

    constructor(container, options, checkNum = true) {
        if(typeof container == 'string') {
            this.container = $(container);
        }else{
            this.container = container;
        }

        this.options = options;
        this.checkNum = checkNum;

        return this._createSlider();
    }

    _createSlider() {
        let self = this;
        let swiper = null;

        this.container.each(function() {
            let $container = $(this);
            let options = $.extend({}, self.options);
            let numSlides = options.slidesPerView || 1;

            $container.removeClass('ya-not-ready');

            if(self.checkNum && $container.find('.swiper-slide').length < numSlides + 1) {
                $container.addClass('ya-not-slider');
                return;
            }

            options = self._getControlsSlider($container, options);

            swiper = new Swiper($container.find('.swiper-container'), options);
        });

        return swiper;
    }

    _getControlsSlider(container, options) {
        options.nextButton = container.find('.swiper-button-next');
        options.prevButton = container.find('.swiper-button-prev');
        options.pagination = container.find('.swiper-pagination');

        return options;
    }
}
