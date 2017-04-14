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
        moveCenter = [0, 0],
        zoom = 16,
        marker = [],
        markerSrc = '',
        markerSize = [0, 0],
        markerOffset = [0, 0],
        controls = true
    }) {
        this.options = {
            mapContainer: mapContainer,
            center: center,
            moveCenter: moveCenter,
            zoom: zoom,
            marker: marker,
            markerSrc: markerSrc,
            markerSize: markerSize,
            markerOffset: markerOffset,
            controls: controls,
            url: 'http://api-maps.yandex.ru/2.1/?lang=ru_RU'
        };

        let self = this;
        self.collectionPlacemark;
        self.waitingMarkersArguments = [];

        this._loadScriptMap()
            .then(function () {
                self._createMap();
            })
            .then(function () {
                if (self.options.marker.length) {
                    self.addMarker({
                        address: self.options.marker,
                        markerSrc: self.options.markerSrc,
                        markerSize: self.options.markerSize,
                        markerOffset: self.options.markerOffset
                    });
                } else if (self.waitingMarkersArguments.length) {
                    // self.waitingMarkersArguments.forEach(function (options) {
                    //     self.addMarker(options);
                    // });
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
        markerSrc = '',
        markerSize = [0, 0],
        markerOffset = [0, 0],
        clear = true,
        draggable = false,
        events = [],
        createBaloon = true
    }) {

        let self = this;
        let optionsMarker = null;

        if (!self.map) {
            let arg = arguments[0];
            setTimeout(function() {
                self.addMarker(arg);
            }, 200);
            // self.waitingMarkersArguments.push(arguments[0]);
            return;
        }

        self.collectionPlacemark = new ymaps.GeoObjectCollection();

        if (clear) {
            self.clearMap();
            // self.placemark = null;
        }

        return new Promise(function (resolve, rejected) {
            $('.ya-map__addresses-li').each(function (i) {
                let $list = $(this);
                let city = $list.find('.ya-map__addresses-city').text();
                let address = $list.find('.ya-map__addresses-full').text();
                let more = '';

                $list.find('.ya-map__addresses-more-li').each(function() {
                    let name = $(this).find('.ya-map__addresses-more-1').html();
                    let description = $(this).find('.ya-map__addresses-more-2').html();

                    more += `<tr>
                                <td>${name}</td>
                                <td>${description}</td>
                            </tr>`;
                });

                MapYandex.getCoordinates(address)
                    .then(function (res) {

                        if (!markerSrc.length) {
                            optionsMarker = {
                                preset: 'islands#icon',
                                iconColor: '#e7221b',
                                draggable: draggable,
                                iconImageSize: [0, 0],
                                iconImageOffset: [0, 0]
                            }
                        } else {
                            optionsMarker = {
                                draggable: draggable,
                                iconLayout: 'default#image',
                                iconImageHref: markerSrc,
                                iconImageSize: markerSize,
                                iconImageOffset: markerOffset
                            }
                        }

                        if(createBaloon) {
                            let MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                                '<div class="ya-map__baloon">' +
                                '<a class="ya-map__baloon-close" href="#">x</a>' +
                                '<div class="ya-map__baloon-arrow"></div>' +
                                '<div class="ya-map__baloon-container">$[[options.contentLayout]]</div>' +
                                '</div>', {
                                    /**
                                     * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                                     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
                                     * @function
                                     * @name build
                                     */
                                    build: function () {
                                        this.constructor.superclass.build.call(this);

                                        this._$element = $('.ya-map__baloon', this.getParentElement());

                                        this.applyElementOffset();

                                        this._$element.find('.ya-map__baloon-close')
                                            .on('click', $.proxy(this.onCloseClick, this));
                                    },

                                    /**
                                     * Удаляет содержимое макета из DOM.
                                     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
                                     * @function
                                     * @name clear
                                     */
                                    clear: function () {
                                        this._$element.find('.ya-map__baloon-close')
                                            .off('click');

                                        this.constructor.superclass.clear.call(this);
                                    },

                                    /**
                                     * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
                                     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                                     * @function
                                     * @name onSublayoutSizeChange
                                     */
                                    onSublayoutSizeChange: function () {
                                        MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                                        if (!this._isElement(this._$element)) {
                                            return;
                                        }

                                        this.applyElementOffset();

                                        this.events.fire('shapechange');
                                    },

                                    /**
                                     * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
                                     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                                     * @function
                                     * @name applyElementOffset
                                     */
                                    applyElementOffset: function () {
                                        this._$element.css({
                                            left: -(this._$element[0].offsetWidth / 2),
                                            top: -(this._$element[0].offsetHeight + this._$element.find('.ya-map__baloon-arrow')[0].offsetHeight)
                                        });
                                    },

                                    /**
                                     * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
                                     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                                     * @function
                                     * @name onCloseClick
                                     */
                                    onCloseClick: function (e) {
                                        e.preventDefault();

                                        this.events.fire('userclose');
                                    },

                                    /**
                                     * Используется для автопозиционирования (balloonAutoPan).
                                     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
                                     * @function
                                     * @name getClientBounds
                                     * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
                                     */
                                    getShape: function () {
                                        if (this._isElement(this._$element)) {
                                            return MyBalloonLayout.superclass.getShape.call(this);
                                        }

                                        var position = this._$element.position();

                                        return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                                            [position.left, position.top], [
                                                position.left + this._$element[0].offsetWidth,
                                                position.top + this._$element[0].offsetHeight + this._$element.find('.ya-map__baloon-arrow')[0].offsetHeight
                                            ]
                                        ]));
                                    },

                                    /**
                                     * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
                                     * @function
                                     * @private
                                     * @name _isElement
                                     * @param {jQuery} [element] Элемент.
                                     * @returns {Boolean} Флаг наличия.
                                     */
                                    _isElement: function (element) {
                                        return element && element[0] && element.find('.ya-map__baloon-arrow')[0];
                                    }
                                }
                            );

                            // Создание вложенного макета содержимого балуна.
                            let MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                                `<div class="ya-map__baloon-title">${city}</div>` +
                                `<div class="ya-map__baloon-text">${address}</div>` +
                                '<table>' +
                                '<tbody>' +
                                more +
                                '</tbody>' +
                                '</table>'
                            );

                            optionsMarker.balloonShadow = false;
                            optionsMarker.balloonLayout = MyBalloonLayout;
                            optionsMarker.balloonContentLayout = MyBalloonContentLayout;
                            optionsMarker.balloonPanelMaxMapArea = 0;
                        }

                        if (typeof optionsMarker.iconImageSize[0] !== 'number') {
                            optionsMarker.iconImageSize = self._getNumber(optionsMarker.iconImageSize);
                        }

                        if (typeof optionsMarker.iconImageOffset[0] !== 'number') {
                            optionsMarker.iconImageOffset = self._getNumber(optionsMarker.iconImageOffset);
                        }

                        let {coords, bounds} = res;
                        let placemark = new ymaps.Placemark(
                            coords,
                            {},
                            optionsMarker
                        );

                        self.placemark = placemark;
                        self._setEventListeners(placemark, events);
                        self.collectionPlacemark.add(placemark);
                        self.map.geoObjects.add(self.collectionPlacemark);
                        // self.map.geoObjects.add(placemark);
                        if($list.siblings().length) {
                            self.map.setBounds(self.collectionPlacemark.getBounds(), {checkZoomRange: true});
                        }else{
                            self._setZoom(bounds);
                            self._setCenter(self._correctCoords(coords));
                        }
                    });
            });
            resolve();
        });

    }

    _correctCoords(coordsArr) {
        let self = this;
        return coordsArr.map((coord, i) => coord + self.options.moveCenter[i]);
    }

    _getNumber(arr) {
        arr.forEach(function (el, i) {
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
        return new Promise(function (resolve, rejected) {
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
            .then(function (res) {
                return new Promise(function (resolve, rejected) {
                    let options = {
                        center: res.coords.map((coord, i) => coord + self.options.moveCenter[i]),
                        zoom: self.options.zoom
                    };

                    if (!self.options.controls) {
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
        return new Promise(function (resolve, rejected) {
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
        if (self.map) {
            self.map.geoObjects.removeAll();
        }
    }

    _setEventListeners(placemark, events) {
        if (!events.length) return;
        events.forEach(function (item, i, arr) {
            placemark.events.add(item.name, item.callback);
        });
    }

    addRoute(points) {
        let self = this;
        return new Promise(function (resolve, reject) {
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
