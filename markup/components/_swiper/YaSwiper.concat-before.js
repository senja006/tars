class YaSwiper {

    constructor(container, options, checkNum = true) {
        if (typeof container == 'string') {
            this.container = $(container);
        } else {
            this.container = container;
        }

        this.options = options;
        this.checkNum = checkNum;

        return this._createSlider();
    }

    _createSlider() {
        let self = this;
        let swiper = null;

        this.container.each(function () {
            let $container = $(this);
            let options = $.extend({}, self.options);
            let numSlides = options.slidesPerView || 1;

            $container.removeClass('ya-not-ready');

            if (!options.breakpoints && !options.breakpoints && self.checkNum && $container.find('.swiper-wrapper').first().children('.swiper-slide').length < numSlides + 1) {
                $container.addClass('ya-not-slider');
                return;
            }

            if (!options.navigation || !options.navigation.nextEl) {
                options.navigation = $.extend({
                    nextEl: $container.find('.swiper-button-next'),
                    prevEl: $container.find('.swiper-button-prev'),
                }, options.navigation);
            }

            if (!options.pagination || !options.pagination.el) {
                options.pagination = $.extend({
                    el: $container.find('.swiper-pagination')
                }, options.pagination);
            }

            swiper = new Swiper($container.find('.swiper-container'), options);
        });

        return swiper;
    }
}
