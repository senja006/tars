yaModules.template = (function () {

    function createMap() {
        let map = new MapYandex({
            mapContainer: 'ya-map',
            center: 'Краснодар',
            // marker: coords,
            markerSrc: '/static/img/general/marker-2x.png',
            markerSize: [41,47],
            markerOffset: [0,-45]
        });
    }

    return {
        init() {
            if ($map.length) {
                createMap();
            }
        }
    }
}());

