yaModules.yaSlider = (function () {

    function initSlider() {
        let sliderMain = new YaSlider('.ya-slider-container--main', {
            effect: 'carousel',
            duration: 600,
            loop: true
        });
        let sliderNav = new YaSlider('.ya-slider-container--nav', {
            effect: 'carousel',
            duration: 600,
            slideClicked: true,
            markOnlySlideClick: true,
            loop: true,
            onBefore: function() {
                console.log('перед');
            },
            onAfter: function() {
                console.log('после');
            }
        });

        sliderMain.setControl(sliderNav);
        sliderNav.setControl(sliderMain);
    }

    return {
        init() {
            if ($('.ya-slider-container').length) {
                initSlider();
            }
        }
    }
}());
