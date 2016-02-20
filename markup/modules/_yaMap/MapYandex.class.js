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
		zoom = 0,
        marker = [],
        markerSrc = '',
        markerSize = [0,0],
        markerOffset = [0,0]
		}) {
		this.options = {
			mapContainer: mapContainer,
			center: center,
			zoom: zoom,
            marker: marker,
            markerSrc: markerSrc,
            markerSize: markerSize,
            markerOffset: markerOffset,
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

        if (clear) {
            this._clearMap();
            this.placemark = null;
        }

        let self = this;
        let optionsMarker = null;

        if(!markerSrc.length) {
            optionsMarker = {
                preset: 'islands#icon',
                iconColor: '#3f90d9',
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
            self.getCoordinates(address)
                .then(function(res) {
                    let {coords, bounds} = res;
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
        return new Promise(function(resolve, rejected) {
            self.map = new ymaps.Map(self.options.mapContainer, {
                center: self.options.center,
                zoom: self.options.zoom,
                //controls: []
            });
            self.map.behaviors.disable('scrollZoom');
            resolve();
        });
	}

	/**
	 * Определяет координаты точки по адресу
	 * @param address {string}
	 * @private
     * @return Promise
	 */
	getCoordinates(address) {
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
	_clearMap() {
		this.map.geoObjects.removeAll();
	}

    _setEventListeners(placemark, events) {
        if(!events.length) return;
        events.forEach(function(item, i, arr) {
            placemark.events.add(item.name, item.callback);
        });
    }

}
