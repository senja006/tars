yaModules.nouislider = (function () {

    let $yaNouisliders = $('.ya-nouislider');

    function initNouislider() {
        $yaNouisliders.each(function() {
            let $container = $(this);
            let $nouislider = $container.find('.nouislider');
            let from = $nouislider.data('from');
            let to = $nouislider.data('to');
            let step = $nouislider.data('step');
            let startValue = $nouislider.data('values').split(',');

            noUiSlider.create($nouislider[0], {
                start: startValue,
                step: step,
                connect: true,
                range: {
                    'min': from,
                    'max': to
                },
                format: wNumb({
                    decimals: 0
                })
            });

            var snapValues = [
                $container.find('.ya-nouislider__min')[0],
                $container.find('.ya-nouislider__max')[0]
            ];

            $nouislider[0].noUiSlider.on('update', function( values, handle ) {
                snapValues[handle].value = values[handle];
            });

            snapValues.forEach(function(el) {
                $(el).on('change', function() {
                    let min = snapValues[0].value;
                    let max = snapValues[1].value;

                    $nouislider[0].noUiSlider.set([min, max]);
                });
            });

            $(document).on('reset', 'form', function() {
                setTimeout(() => {
                    $nouislider[0].noUiSlider.set(startValue);
                    $(snapValues[0]).val(startValue[0]);
                    $(snapValues[1]).val(startValue[1]);
                }, 0);
            });
        });
    }

    return {
        init() {
            if ($yaNouisliders.length) {
                initNouislider();
            }
        }
    }
}());
