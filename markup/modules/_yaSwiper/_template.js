yaModules.template = (function () {

    function initPlagin() {
        new YaSwiper($('.swiper-container-info'), {
            slidesPerView: 5,
            spaceBetween: 30
        });

        $('.swiper-container-info-remodal').each(function() {
            let $container = $(this);

            let sliderMain = new YaSwiper($container.find('.swiper-container-info--main'), {
                width: 626,
                height: 373
            });
            let sliderNav = new YaSwiper($container.find('.swiper-container-info--nav'), {
                slidesPerView: 4,
                spaceBetween: 23,
                slideToClickedSlide: true,
                centeredSlides: true,
                width: 626,
                height: 104
            }, false);

            sliderMain.params.control = sliderNav;
            sliderNav.params.control = sliderMain;
        });
    }

    return {
        init() {
            if ($('.swiper-container').length) {
                initPlagin();
            }
        }
    }
}());
