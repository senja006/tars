yaModules.yaSliderRange = (function () {

    let $slidersRange = $('.ya-slider-range--range');
    let $slidersRangeSingle = $('.ya-slider-range--single');
    let $sliderInputMin = $('.ya-slider-range__min');
    let $sliderInputMax = $('.ya-slider-range__max');

    function addEventListeners() {
        if($slidersRange.length || $slidersRangeSingle.length) {
            $sliderInputMin.on('focusout', setValueSliderRange);
            $sliderInputMax.on('focusout', setValueSliderRange);
            $(document).on('reset', 'form', resetSliderRange);
        }
    }

    function initSliderRange() {
        $slidersRange.each(function() {
            let $input = $(this).find('.ya-slider-range__input');
            let from = $input.data('from');
            let to = $input.data('to');
            let step = $input.data('step');
            $input.jRange({
                from: from,
                to: to,
                step: step,
                theme: 'theme-skl',
                width: '100%',
                isRange : true,
                onstatechange: setValueInputRange
            });
        });
    }

    function setValueInputRange(strValues) {
        let values = strValues.split(',');
        $sliderInputMin.val(values[0]);
        $sliderInputMax.val(values[1]);
    }

    function setValueSliderRange() {
        let $sliderRange = $(this).parents('.ya-slider-range').find('.ya-slider-range__input');
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
    }

    function resetSliderRange() {
        let $sliderRange = $(this).find('.ya-slider-range').find('.ya-slider-range__input');

        if(!$sliderRange.length) return;

        let defaultValue = $sliderRange.data('default-value');
        setTimeout(() => {
            $sliderRange.jRange('setValue', defaultValue);
        });
    }

    function initSliderRangeSingle() {
        $slidersRangeSingle.each(function() {
            let $input = $(this).find('.ya-slider-range__input');
            let from = $input.data('from');
            let to = $input.data('to');
            let step = $input.data('step');
            $input.jRange({
                from: from,
                to: to,
                step: step,
                theme: 'theme-skl',
                width: '100%',
                onstatechange: setValueInputRange
            });
        });
    }

    return {
        init() {
            if($slidersRange.length) {
                initSliderRange();
            }
            if($slidersRangeSingle.length) {
                initSliderRangeSingle();
            }
            addEventListeners();
        }
    }
}());
