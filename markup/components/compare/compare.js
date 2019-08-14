yaModules.compare = (function () {

    let $compareSlider = $('.swiper-container-main--compare');
    let heightProductCard = 0;
    let offsetTopSlider = 0;

    function addEventListeners() {
        $('.ya-compare__feature-table tr').hover(trMarkHover, trUnmarkHover);
        $('body').on('ya-tabs-changed', function() {
            initSlider();
            yaModules.yaSticky.customInit();
            yaModules.yaSticky.recalc();
        });
        $(window).on('scroll', toggleFixedCompare);
        $(window).on('resize', getParamsToShowFixedCompare);
    }

    function getParamsToShowFixedCompare() {
        let $compareContent = $('.ya-compare__content.ya-js-calc-sticky');

        if($compareContent.length) {
            $compareContent.find('.ya-compare__col.js-with-slider').find('.ya-card').each(function() {
                let heightCard = $(this).outerHeight();

                if(heightCard !== 0) {
                    heightProductCard = heightCard;
                    return;
                }
            });
            $compareContent.each(function() {
                let top = $(this).offset().top;

                if(top !== 0) {
                    offsetTopSlider = top;
                    return;
                }
            });
        }
    }

    function toggleFixedCompare() {
        let scrollTop = $(window).scrollTop();

        if(offsetTopSlider === 0 || heightProductCard === 0) {
            getParamsToShowFixedCompare();
        }

        if(scrollTop > offsetTopSlider + heightProductCard / 2 + 50) {
            $('.ya-sticky').addClass('ya-is-visible');
        }else{
            $('.ya-sticky').removeClass('ya-is-visible');
        }
    }

    function initSlider() {
        $compareSlider.each(function () {
            let $slider = $(this);

            if($slider.parents('.ya-tabs__list-li').css('display') === 'none' || $slider.find('.swiper-container-initialized').length) return;

            let $navContainer = $slider.parents('.ya-tabs__list-li').find('.ya-swiper__nav-container--compare');

            let sliderMain = new YaSwiper($slider, {
                slidesPerView: 3,
                spaceBetween: 10,
                navigation: {
                    nextEl: $navContainer.find('.swiper-button-next'),
                    prevEl: $navContainer.find('.swiper-button-prev'),
                },
                pagination: {
                    el: $navContainer.find('.swiper-pagination'),
                    type: 'fraction',
                    formatFractionCurrent: number => number < 10 ? '0' + number : number,
                    formatFractionTotal: number => number < 10 ? '0' + number : number,
                },
                breakpoints: { // при изменении breakpoints необходимо также вносить правки в css
                    1070: {
                        slidesPerView: 2,
                    },
                    800: {
                        slidesPerView: 1,
                    }
                },
            });
            if (!$slider.hasClass('ya-not-slider')) {
                $navContainer.css('display', 'block');
            }

            let $fixedSlider = $slider.parents('.ya-compare__content').first().find('.swiper-container-main--fixed');

            let sliderNav = new YaSwiper($fixedSlider, {
                slidesPerView: 3,
                spaceBetween: 10,
                breakpoints: { // при изменении breakpoints необходимо также вносить правки в css
                    1070: {
                        slidesPerView: 2,
                    },
                    800: {
                        slidesPerView: 1,
                    }
                }
            });

            synchronizationSliders(sliderMain, sliderNav);

            function synchronizationSliders(sliderMain, sliderNav, iter = true) {
                sliderMain.on('touchMove', function () {
                    sliderNav.setTranslate(sliderMain.getTranslate());
                });

                sliderMain.on('touchEnd', function () {
                    sliderNav.slideTo(sliderMain.realIndex);
                });

                sliderMain.on('slideChange', function () {
                    sliderNav.slideTo(sliderMain.realIndex);
                });

                if (iter) {
                    synchronizationSliders(sliderNav, sliderMain, false);
                }
            }

            $('body').on('ya-tabs-changed', function() {
                // setTimeout(function() {
                    sliderMain.update();
                    // sliderNav.update();
                // }, 10);
            });
            $(window).on('resize', function() {
                setTimeout(function() {
                    sliderMain.update();
                    sliderNav.update();
                }, 10);
            });
            $('.ya-sticky').on("sticky_kit:stick", function() {
                // sliderMain.update();
                sliderNav.update();
            });
        });
    }

    function markTrTable() {
        let $tabs = $('.ya-compare').find('.ya-tabs');

        $tabs.each(function (tabsIndex) {
            let $tabs = $(this);
            let $tableContainer = $tabs.find('.ya-compare__feature');

            $tableContainer.each(function () {
                let $tableContainer = $(this);

                $tableContainer.find('tr').each(function (trIndex) {
                    let $tr = $(this);

                    if ($tr.hasClass('ya-not-hover')) return;

                    let newClass = 'ya-compare-tr-num-' + tabsIndex + trIndex;

                    $tr.addClass(newClass);
                    $tr.data('class-tr', '.ya-compare-tr-num-' + tabsIndex + trIndex);
                });
            });
        });
    }

    function trMarkHover() {
        let classTr = $(this).data('class-tr');

        $(classTr).addClass('ya-is-hover');
    }

    function trUnmarkHover() {
        $('tr.ya-is-hover').removeClass('ya-is-hover');
    }

    return {
        init() {
            if ($compareSlider.length) {
                getParamsToShowFixedCompare();
                toggleFixedCompare();
                markTrTable();
                addEventListeners();
                initSlider();
            }
        }
    }
}());

