yaModules.map = (function () {

    let $maps = $('[data-map]');
    let apiKey = '61a63f43-abf7-4669-8a90-0fc9bbecdb5f';
    let placemarkOptions = {
        iconLayout: 'default#imageWithContent',
        iconImageHref: 'static/img/general/map-icon.png',
        iconImageSize: [46, 61],
        iconImageOffset: [-23, -61],
        // iconContentOffset: [23, 122],
    };

    // TODO: ключ API для карты

    function addEventListeners() {
        $('html').on('ya-map-script-is-load', function () {
            createMap($maps);
        });
    }

    function loadScript() {
        $.getScript('https://api-maps.yandex.ru/2.1/?apikey=' + apiKey + '&lang=ru_RU', function () {
            $('html').trigger('ya-map-script-is-load');
        });
    }

    function createMap(options) {
        let defaultOptions = {
            maps: options.maps ? options.maps : $maps,
            coordsContainer: options.coordsContainer ? options.coordsContainer : $maps,
            cb: options.cb ? options.cb : function () {},
            createBaloon: options.createBaloon !== false,
            baloonIsOpen: options.baloonIsOpen === true,
            controls: ['zoomControl']
        };

        defaultOptions.maps.each(function () {
            let $map = $(this);
            let $mapContainer = $map.find('[data-map-container]');

            if (!$mapContainer.length || !isVisible($mapContainer) || $map.hasClass('ya-map-is-init')) {
                return;
            }

            if (typeof ymaps === 'undefined') {
                if (!$map.hasClass('ya-is-load-on')) {
                    $map.addClass('ya-is-load-on');
                    $('html').on('ya-map-script-is-load', function () {
                        createMap(defaultOptions);
                    });
                }
                return;
            }

            $map.addClass('ya-map-is-init');

            let id = $mapContainer.attr('id');
            let points = [];

            if (defaultOptions.coordsContainer.length) {
                defaultOptions.coordsContainer.find('[data-map-coord]').each(function (i) {
                    points[i] = $(this).data('map-coord');
                });
            }

            ymaps.ready(function () {
                let map;
                let options;

                if (points.length > 1) {
                    options = {
                        bounds: ymaps.util.bounds.fromPoints(points),
                        controls: defaultOptions.controls
                    }
                } else {
                    options = {
                        center: points[0],
                        zoom: 17,
                        controls: defaultOptions.controls
                    }
                }

                map = new ymaps.Map(id, options, {
                    searchControlProvider: 'yandex#search'
                });

                map.setZoom(map.getZoom() - 1);
                map.behaviors.disable('scrollZoom');

                let placemarks = createPlacemarks(defaultOptions, $map, map);

                defaultOptions.cb(map, $map, placemarks);
                // map.container.fitToViewport();
            });
        });
    }

    function isVisible(element) {
        let isVisible = (element.css('display') !== 'none' && element.css('visibility') !== 'hidden' && element.css('opacity') !== '0');

        if (!isVisible) {
            return false;
        }
        let $parents = element.parents();

        $parents.each(function () {
            isVisible = ($(this).css('display') !== 'none' && $(this).css('visibility') !== 'hidden' && $(this).css('opacity') !== '0');
            return isVisible;
        });

        return isVisible;
    }

    function createPlacemarks(defaultOptions, $map, map) {
        let placemarks = [];

        defaultOptions.coordsContainer.find('[data-map-coord]').each(function (i) {
            let $point = $(this);
            let coord = $point.data('map-coord');
            let baloonContent = '';
            let nameCoord = getData($point, 'map-title');
            let timeCoord = getData($point, 'map-time');
            let hintContent = nameCoord || timeCoord ? '<div style="color: black;"><b>' + nameCoord + '</b><br>' + timeCoord + '</div>' : '';

            if(defaultOptions.createBaloon) {
                let baloonMarker = getData($point, 'baloon-marker');
                let baloonTitle = getData($point, 'baloon-title');
                let baloonAddress = getData($point, 'baloon-address');
                let baloonTime = getData($point, 'baloon-time');
                let baloonTable = $map.find('[data-map-table]').html() ? $map.find('[data-map-table]').html() : '';

                baloonContent = `<div class="ya-map-content">
                                    <div class="ya-map-content__marker">${baloonMarker}</div>
                                    <div class="ya-map-content__title">${baloonTitle}</div>
                                    <div class="ya-map-content__address">${baloonAddress}</div>
                                    <div class="ya-map-content__time">${baloonTime}</div>
                                    <table class="ya-map-content__table">${baloonTable}</table>
                                </div>`;
            }

            let placemark = new ymaps.Placemark(coord, {
                    hintContent: hintContent,
                    balloonContentBody: baloonContent,
                },
                placemarkOptions
            );
            map.geoObjects.add(placemark);
            placemarks[i] = placemark;

            if(defaultOptions.baloonIsOpen) {
                placemark.balloon.open();
            }
        });

        return placemarks;
    }

    function getData(el, name) {
        let data = el.data(name) ? el.data(name) : el.find('[data-' + name + ']').data(name);

        return data ? data : '';
    }

    return {
        init() {
            if ($maps.length) {
                loadScript();
                addEventListeners();
            }
        },
        createMap(options) {
            createMap(options);
        }
    }
}());


