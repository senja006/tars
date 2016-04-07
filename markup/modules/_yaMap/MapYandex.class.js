/**
 * Управление Яндекс картой
 */

class MapYandex {

    /**
     * Конструктор
     * @param mapContainer {string} - без точки для классов и без решетки для id
     * @param center {array} - координаты центра
     * @param zoom {number} - коэффициент увеличения
     * @param marker {array} - координаты маркера
     * @param markerSrc {string} - url изображения маркера
     * @param markerSize {array} - размеры маркера
     * @param markerOffset {array} - сдвиг маркера
     */
    constructor({
        mapContainer = 'ya-map',
        center = [],
        zoom = 16,
        marker = [],
        markerSrc = '',
        markerSize = [0,0],
        markerOffset = [0,0],
        controls = true
        }) {
        this.options = {
            mapContainer: mapContainer,
            center: center,
            zoom: zoom,
            marker: marker,
            markerSrc: markerSrc,
            markerSize: markerSize,
            markerOffset: markerOffset,
            controls: controls,
            url: 'http://api-maps.yandex.ru/2.1/?lang=ru_RU'
        };

        let self = this;
        this._loadScriptMap()
            .then(function() {
                self._createMap();
            })
            .then(function() {
                if(self.options.marker.length) {
                    self.addMarker({
                        address: self.options.marker,
                        markerSrc: self.options.markerSrc,
                        markerSize: self.options.markerSize,
                        markerOffset: self.options.markerOffset
                    });
                }
            });
    }

    /**
     * Добавляет маркер на карту
     * @param options
     * address {string} или {array} - адрес. Строка либо массив с координатами
     * clear {boolean} - очищать ли карту от предыдущих маркеров
     * draggable {boolean} - маркер можно перетаскивать
     * events {array} - массив объектов с событиями, где name - название события, callback - колбэк для события
     */
    addMarker({
        address,
        markerSrc = '',
        markerSize = [0,0],
        markerOffset = [0,0],
        clear = true,
        draggable = false,
        events = []
        }) {

        let self = this;
        let optionsMarker = null;

        if (clear) {
            self.clearMap();
            self.placemark = null;
        }

        if(!markerSrc.length) {
            optionsMarker = {
                preset: 'islands#icon',
                iconColor: '#e7221b',
                draggable: draggable,
                iconImageSize: [0,0],
                iconImageOffset: [0,0]
            }
        }else{
            optionsMarker = {
                draggable: draggable,
                iconLayout: 'default#image',
                iconImageHref: markerSrc,
                iconImageSize: markerSize,
                iconImageOffset: markerOffset
            }
        }

        if(typeof optionsMarker.iconImageSize[0] !== 'number') {
            optionsMarker.iconImageSize = self._getNumber(optionsMarker.iconImageSize);
        }

        if(typeof optionsMarker.iconImageOffset[0] !== 'number') {
            optionsMarker.iconImageOffset = self._getNumber(optionsMarker.iconImageOffset);
        }

        return new Promise(function(resolve, rejected) {
            MapYandex.getCoordinates(address)
                .then(function(res) {
                    let {coords, bounds} = res;
                    if(typeof address == 'object') {
                        coords = address;
                    }
                    let placemark = new ymaps.Placemark(
                        coords,
                        {},
                        optionsMarker
                    );
                    self.placemark = placemark;
                    self._setEventListeners(placemark, events);
                    self.map.geoObjects.add(placemark);
                    self._setCenter(coords);
                    self._setZoom(bounds);
                    resolve();
                });
        });

    }

    _getNumber(arr) {
        arr.forEach(function(el, i) {
            arr[i] = +el;
        });

        return arr;
    }

    getMarkerCoords() {
        return this.placemark.geometry.getCoordinates();
    }

    /**
     * Загружает скрипт карт с сервера Яндекс
     * @private
     */
    _loadScriptMap() {
        let self = this;
        return new Promise(function(resolve, rejected) {
            $.getScript(self.options.url, function () {
                ymaps.ready(resolve);
            });
        });
    }

    /**
     * По завершении загрузки создает карту и помещает ее в контейнер
     * @private
     */
    _createMap() {
        let self = this;
        MapYandex.getCoordinates(self.options.center)
            .then(function(res) {
                return new Promise(function(resolve, rejected) {
                    let options = {
                        center: res.coords,
                        zoom: self.options.zoom
                    };

                    if(!self.options.controls) {
                        options.controls = [];
                    }

                    self.map = new ymaps.Map(self.options.mapContainer, options);
                    self.map.behaviors.disable('scrollZoom');
                    resolve();
                });
            });
    }

    /**
     * Определяет координаты точки по адресу
     * @param address {string}
     * @private
     * @return Promise
     */
    static getCoordinates(address) {
        return new Promise(function(resolve, rejected) {
            if (!ymaps.geocode) return;
            ymaps.geocode(address, {
                results: 1
            }).then(res => {
                let data = {
                    coords: [],
                    bounds: 0
                };
                let firstGeoObject = res.geoObjects.get(0);
                data.coords = firstGeoObject.geometry.getCoordinates();
                data.bounds = firstGeoObject.properties.get('boundedBy');
                resolve(data);
            });
        });
    }

    /**
     * Устанавливает новый центр карты
     * @param address {array}
     * @private
     */
    _setCenter(address) {
        this.map.panTo(address, {
            flying: false
        });
    }

    /**
     * Установка увеличения карты
     * @param zoom {number}
     * @private
     */
    _setZoom(zoom) {
        this.map.setBounds(zoom, {
            // Проверяем наличие тайлов на данном масштабе.
            checkZoomRange: true
        });
    }

    /**
     * Удаление всех нанесенных на карту объектов
     * @private
     */
    clearMap() {
        let self = this;
        if(self.map) {
            self.map.geoObjects.removeAll();
        }
    }

    _setEventListeners(placemark, events) {
        if(!events.length) return;
        events.forEach(function(item, i, arr) {
            placemark.events.add(item.name, item.callback);
        });
    }

    addRoute(points) {
        let self = this;
        return new Promise(function(resolve, reject) {
            ymaps.route(points, {
                mapStateAutoApply: true
            }).then(function (route) {
                self.clearMap();
                self.map.geoObjects.add(route);
                // Зададим содержание иконок начальной и конечной точкам маршрута.
                // С помощью метода getWayPoints() получаем массив точек маршрута.
                // Массив транзитных точек маршрута можно получить с помощью метода getViaPoints.
                var points = route.getWayPoints(),
                    lastPoint = points.getLength() - 1;
                // Задаем стиль метки - иконки будут красного цвета, и
                // их изображения будут растягиваться под контент.
                points.options.set('preset', 'islands#redStretchyIcon');
                // Задаем контент меток в начальной и конечной точках.
                points.get(0).properties.set('iconContent', 'Точка отправления');
                points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');
                resolve();
            }, function (error) {
                //alert('Возникла ошибка: ' + error.message);
                reject();
            });
        });
    }

}
