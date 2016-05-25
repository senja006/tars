yaModules.yaSliderRange = (function () {

    let $slidersRange = $('.ya-slider-range');

    function initSliderRange($containerRange) {
        $containerRange.each(function() {
            let $container = $(this);
            let $sliderRange = $container.find('.ya-slider-range__input');
            let from = $sliderRange.data('from');
            let to = $sliderRange.data('to');
            let step = $sliderRange.data('step');
            let isRange = $container.hasClass('ya-slider-range--range') ? true : false;
            let $sliderInputMin = $container.find('.ya-slider-range__min');
            let $sliderInputMax = $container.find('.ya-slider-range__max');

            $sliderRange.jRange({
                from: from,
                to: to,
                step: step,
                theme: 'theme-skl',
                width: '100%',
                isRange : isRange,
                onstatechange: function(strValues) {
                    let values = strValues.split(',');
                    $sliderInputMin.val(values[0]);
                    $sliderInputMax.val(values[1]);
                }
            });

            $(document).on('focusout', [$sliderInputMin, $sliderInputMax], function() {
                let valuesSliderRange = $sliderRange.val().split(',');
                let valueInputMin = +($sliderInputMin.val());
                let currentValueMin = valueInputMin >= valuesSliderRange[1] ? valuesSliderRange[1] : valueInputMin;

                if($sliderInputMax.length) {
                    var valueInputMax = +($sliderInputMax.val());
                    var currentValueMax = valueInputMax <= valuesSliderRange[0] ? valuesSliderRange[0] : valueInputMax;
                    $sliderInputMax.val(currentValueMax);
                }
                let currentValue = currentValueMax ? currentValueMin + ',' + currentValueMax : currentValueMin + ' ';

                $sliderInputMin.val(currentValueMin);
                $sliderRange.jRange('setValue', currentValue);
            });

            $(document).on('reset', 'form', function() {
                if(!$(this).find('.ya-slider-range').length) return;

                let defaultValue = $sliderRange.data('default-value');
                setTimeout(() => {
                    $sliderRange.jRange('setValue', defaultValue);
                });
            });
        });
    }

    return {
        init() {
            if($slidersRange.length) {
                initSliderRange($slidersRange);
            }
        },
        initSingle($containerRange) {
            initSliderRange($containerRange);
        }
    }
}());
