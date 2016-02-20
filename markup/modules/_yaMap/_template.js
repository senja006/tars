yaModules.yaMap = (function () {

    let idMap = 'ya-map';
    let $map = $(`#${idMap}`);
    let coords = 'Краснодар тургенева 213';

    function createMap() {
        let map = new MapYandex({
            mapContainer: idMap,
            center: coords,
            marker: coords,
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

