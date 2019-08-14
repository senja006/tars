yaModules.template = (function () {

    let sliders = {
        'leftBig': {
            className: '.swiper-container-main--left-big',
            options: {
                slidesPerView: 2,
                spaceBetween: 86,
                pagination: {
                    type: 'fraction',
                    formatFractionCurrent: number => number < 10 ? '0' + number : number,
                    formatFractionTotal: number => number < 10 ? '0' + number : number,
                },
                loop: true,
            }
        },
        single: {
            className: '.swiper-container-main--single',
            options: {
                slidesPerView: 1,
                spaceBetween: 0,
                // effect: 'fade',
                loop: true,
            }
        }
    };

    function initPlagin() {
        function initPlagin() {
        Object.keys(sliders).forEach(function (key, id) {
            let $slider = $(sliders[key].className);
            if ($slider.length) {
                $slider.each(function() {
                    let $this = $(this);
                    new YaSwiper($this, sliders[key].options);
                });
            }
        });
    }


        // new YaSwiper($('.swiper-container-info'), {
        //     slidesPerView: 5,
        //     spaceBetween: 30
        // });

        // $('.swiper-container-info-remodal').each(function() {
        //     let $container = $(this);

        //     let sliderMain = new YaSwiper($container.find('.swiper-container-info--main'), {
        //         width: 626,
        //         height: 373
        //     });
        //     let sliderNav = new YaSwiper($container.find('.swiper-container-info--nav'), {
        //         slidesPerView: 4,
        //         spaceBetween: 23,
        //         slideToClickedSlide: true,
        //         centeredSlides: true,
        //         width: 626,
        //         height: 104
        //     }, false);

        //     sliderMain.params.control = sliderNav;
        //     sliderNav.params.control = sliderMain;
        // });
    }

    return {
        init() {
            initPlagin();
        }
    }
}());
