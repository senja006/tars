yaModules.template = (function () {

    function addEventListeners() {
        $('body').on('ya-tabs-changed', function () {
            yaModules.map.createMap({
                maps: $maps,
                coordsContainer: $(''),
                cb: function(map) {
                    $('body').on('ya-tabs-changed', function () {
                        map.container.fitToViewport();
                        // map.setCenter(coord, 16);
                    });
                }
            });
        });

        $('.ya-geo__open-map').on('click', function (ev) {
            ev.preventDefault();

            if (typeof ymaps === 'undefined') return;

            let $container = $(this).parents('[data-map]');
            // let $map = $container.find('[data-map-container]');

            // $map.parents('.ya-geo__list-content-map').addClass('ya-is-open');
            // $container.trigger('ya-map-is-open');

            yaModules.map.createMap({
                maps: $container,
                coordsContainer: $container,
                cb: function(map, $map, placemarks) {
                    map.events.add('balloonclose', closeSingleMap);
                    $container.on('ya-map-is-open', function () {
                        map.container.fitToViewport();
                        placemarks[0].balloon.open();
                    });
                },
                baloonIsOpen: true,
                // createBaloon: false
            });
        });
    }

    return {
        init() {
            addEventListeners();
        }
    }
}());

