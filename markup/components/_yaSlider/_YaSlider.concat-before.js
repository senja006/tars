class YaSlider {

    constructor(container, options) {
        let self = this;

        // определение контейнера
        if(typeof container == 'string') {
            self.$container = $(container);
        }else{
            self.$container = container;
        }

        // стандартные настройки
        let optionsDefault = {
            effect: 'fade', // эффекты (fade, carousel)
            duration: 300, // длительность анимации
            loop: false, // зацикливание
            slideClicked: false, // возможность кликнуть на слайд
            cssEasing: 'ease', // функция анимации
            touchEvents: true, // обработка событий touch экранов
            hideEmptiness: true, // заполнение пустоты при выключенном режиме loop
            markOnlySlideClick: false, // пометка активного слайда только при клике на слайд (плохо работает управление другим слайдером в режиме loop)
            slidesPerScroll: 1, // количество прокручиваемых слайдов
            numClone: 0, // количество комплектов клонов для режима loop. При значении 0 определяется автоматически
            responsive: false, // сдвиг wraper при изменении ширины экрана
            delayAfterClick: 0, // блокировка элементов управления после клика
            autoplay: 0, // слайдшоу
            onBefore: function() {}, // callback перед слайдингом
            onAfter: function() {}, // callback после слайдинга
        };

        // классы
        self.classes = {
            sliderReady: 'ya-slider-ready',
            slide: 'ya-slider__slide',
            slideIn: 'ya-slider__slide-in',
            button: 'ya-slider__button',
            buttonPrev: 'ya-slider__button--prev',
            buttonNext: 'ya-slider__button--next',
            dotsContainer: 'ya-slider__dots',
            dotsLi: 'ya-slider__dots-li',
            dotsButton: 'ya-slider__dots-button',
            counter: 'ya-slider__counter',
            active: 'ya-slide-active',
            disable: 'ya-slider-disable',
            slideClone: 'ya-clone',
            customAnim: 'ya-slider-custom-anim'
        };

        // список обработчиков событий
        self.handlers = {
            [self.classes.button]: self._handlerClickButton,
            [self.classes.slideIn]: self._handlerClickSlide,
            [self.classes.dotsButton]: self._handlerClickDots
        } ;

        // начальные значения переменных
        self.numActiveSlide = 0;
        self.direction = 'none'; // направление (next, prev, none)
        self.$slides = self.$container.find('.' + self.classes.slide);
        self.slideWidth = self.$slides.outerWidth();
        self.$wrapper = self.$container.find('.ya-slider__wrapper');
        self.$counter = self.$container.find('.' + self.classes.counter); // счетчик слайдов
        self.slidesPerView = Math.round(self.$wrapper.outerWidth() / self.$slides.outerWidth());
        self.controlSlider = null; // слайдер для синхронизации
        self.flagControlSlider = true; // управлять ли другим слайдером
        self.touchStartX = null;
        self.touchStartY = null;
        self.translateWrapper = 0; // величина последнего сдвига .ya-slider__wrapper
        self.translateWrapperTouchmove = 0; // величина последнего сдвига touchmove .ya-slider__wrapper
        self.numClone = 0; // количество копий вставленных клонов
        self.isAnim = false; // флаг анимации для режима loop
        self.touchStartEvent = false; // событие touchstart сработало
        self.blockOriginalTouchEvents = undefined; // блокировка стандартных событий touch
        self.isStart = true; // первичное срабатывание при инициализации
        self.nextActiveSlide = null; // следующий слайд при клике на слайд
        self.clickSlide = false; // обработка клика на слайд
        self.sliderSmall = self.$slides.length <= self.slidesPerView; // количество слайдов меньше чем помещается на экран
        self.windowWidth = 0; // ширина экрана для responsive
        self.intervalAutoplay = null; // таймер слайдшоу

        // пометка контейнера слайдера при малом количестве слайдов
        if(self.sliderSmall) {
            self.$container.addClass('ya-slider-small');
        }

        // применение кастомных настроек
        self.options = $.extend({}, optionsDefault, options);

        // поиск управляющих элементов
        self.controls = {
            $buttonPrev: self.$container.find('.' + self.classes.buttonPrev),
            $buttonNext: self.$container.find('.' + self.classes.buttonNext),
            $dotsContainer: self.$container.find('.' + self.classes.dotsContainer),
            $dots: null
        };

        // создание точек управления
        if(self.controls.$dotsContainer.length && !self.sliderSmall) {
            let lengthSlide = self.$slides.length;
            let $templateDots = $(`<li class="${self.classes.dotsLi}"><button class="${self.classes.dotsButton}"></button></li>`);
            let $dotsUl = self.controls.$dotsContainer.find('ul');

            for(let i = 0; i < lengthSlide; i++) {
                let $dots = $templateDots.clone();

                $dots.find('button').data('num', i);
                $dotsUl.append($dots);
            }

            self.controls.$dots = $dotsUl.find('.' + self.classes.dotsButton);
        }

        // нумерация слайдов
        self.$slides.each(function(i) {
            $(this).attr('data-num', i);
        });

        // сброс длительности анимации
        self._setTransitionDuration(self.$slides, 0);
        self._setTransitionDuration($('.' + self.classes.customAnim), 0);

        // продолжение инициализации
        self._continueInit();
    }

    _continueInit() {
        let self = this;
        if(!pageLoad) {
            setTimeout(self._continueInit.bind(self), 100);
            return;
        }

        // установка высоты wrapper
        let maxHeightSlides = 0;
        self.$slides.each(function() {
            let heightCurrentSlide = $(this).outerHeight();
            if(heightCurrentSlide > maxHeightSlides) {
                maxHeightSlides = heightCurrentSlide;
            }
        });
        self.$wrapper.css('height', maxHeightSlides);

        // добавление класса эффекта
        let effectClass = 'ya-effect-' + self.options.effect;
        self.$container.addClass(effectClass);

        // добавление информации о возможности кликнуть на слайд
        if(self.options.slideClicked) {
            self.$container.addClass('ya-slide-clicked');
        }

        // маркировка первого слайда при маркировке активного слайда только при клике на слайд
        if(self.options.markOnlySlideClick) {
            self._addActiveClassToSlide();
        }

        // создание счетчика
        if(self.$counter.length) {
            self.$counter.find('.' + self.classes.counter + '-all').text(self.$slides.length);
        }

        // создание дублей слайдов для режима зацикливания
        if(self.options.loop && !self.sliderSmall) {
            self.direction = 'none';

            if(self.options.effect == 'carousel') {
                self.numClone = self.options.numClone || Math.ceil(self.slidesPerView * 2 / self.$slides.length);

                for(let i = 0; i < self.numClone; i++) {
                    let $slidesClone = self.$slides.clone();

                    $slidesClone.addClass(self.classes.slideClone);
                    self._addActiveClassToSlide();
                    self.$wrapper.prepend($slidesClone.clone()).append($slidesClone.clone());
                }
            }
        }

        // показ первого слайда
        self._showNextSlide();

        setTimeout(() => {
            // добавление класса готовности слайдера
            self.$container.addClass(self.classes.sliderReady);

            // подписка на события
            self._addEventListeners();

            // установка длительности анимации
            self._setTransitionDuration(self.$slides, self.options.duration);
            self._setTransitionDuration(self.$wrapper, self.options.duration);
            self._setTransitionDuration($('.' + self.classes.customAnim), self.options.duration);

            // старт слайдшоу
            self._startAutoplay();

            // сброс флага первоначального старта при инициализации
            self.isStart = false;
        }, 0);
    }

    /**
     * Установка обработчиков
     * @private
     */
    _addEventListeners() {
        let self = this;

        // клик на кнопки
        self.$container.on('click', '.' + self.classes.button, self._generalHandler.bind(self));

        // клик на точки
        self.controls.$dotsContainer.on('click', '.' + self.classes.dotsButton, self._generalHandler.bind(self));

        // клик на слайд
        if(self.options.slideClicked) {
            self.$container.on('click', '.' + self.classes.slideIn, self._generalHandler.bind(self));
        }

        // обработка touch событий
        if(self.options.touchEvents) {
            self.$wrapper.on('touchstart', self._handlerTouchStart.bind(self));
            self.$wrapper.on('touchend', self._handlerTouchEnd.bind(self));
            self.$wrapper.on('touchmove', self._handlerTouchMove.bind(self));
        }

        if(self.options.responsive) {
            $(window).on('resize', self._moveWrapperResizeWindow.bind(self));
        }
    }

    /**
     * Главный обработчик событий
     * @param ev
     * @private
     */
    _generalHandler(ev) {
        let self = this;
        let $target = $(ev.target);

        // проверка окончания анимации в режиме loop эффекта carousel или установленной задержке
        if(self.isAnim) return;

        clearInterval(self.intervalAutoplay);

        // проверка активности элемента или блокировки
        if($target.closest('.' + self.classes.active).length || $target.closest('.' + self.classes.disable).length) return;

        let handlersEvents = self.handlers;
        let numNextSlide = null;

        // запуск необходимого обработчика для определения номера следующего слайда
        for(let key in handlersEvents) {
            let $currentTarget = $target.closest('.' + key);
            if($currentTarget.length) {
                numNextSlide = handlersEvents[key].call(self, ev, $currentTarget);
            }
        }

        // установка направления
        //self.options.loop ? undefined : self._setDirection(numNextSlide);
        self._setDirection(numNextSlide);

        // корректировка выхода за пределы длины слайдов
        numNextSlide = self._adjustmentNumNextSlide(numNextSlide);

        // показ следующего слайда
        self._showNextSlide(numNextSlide);

        self._startAutoplay();
    }

    /**
     * Слайдшоу
     * @private
     */
    _startAutoplay() {
        let self = this;
        if(!self.options.autoplay) return;

        self.intervalAutoplay = setInterval(() => {
            self.$container.find('.' +self.classes.buttonNext).click();
        }, self.options.autoplay);
    }

    /**
     * Обработчик клика на кнопки влево-вправо
     * @param ev
     * @private
     */
    _handlerClickButton(ev, button) {
        let self = this;
        let numNextSlide = null;

        // определение следующего номера активного слайда
        if(button.hasClass(self.classes.buttonPrev)) {
            numNextSlide = self.numActiveSlide - self.options.slidesPerScroll;

            // установка направления
            self.options.loop ? self._setDirection('prev') : undefined;
        }else{
            numNextSlide = self.numActiveSlide + self.options.slidesPerScroll;

            // установка направления
            self.options.loop ? self._setDirection('next') : undefined;
        }

        return numNextSlide;
    }

    /**
     * Обработчк клика на точки
     * @param ev
     * @private
     */
    _handlerClickDots(ev, dot) {
        // определение следующего номера активного слайда
        let numNextSlide = dot.data('num');

        return numNextSlide;
    }

    /**
     * Обработка клика на слайд
     * @param ev
     * @private
     */
    _handlerClickSlide(ev, slide) {
        let self = this;
        self.nextActiveSlide = slide.closest('.' + self.classes.slide);
        self.clickSlide = true;

        // определение следующего номера активного слайда
        let numNextSlide = self.nextActiveSlide.data('num');

        // установка направления
        if(self.options.loop) {
            let $activeSlide = self.$slides.filter('.' + self.classes.active);
            let $slides = self.$wrapper.find('.' + self.classes.slide);
            let eqActiveSlide = $slides.index($activeSlide);
            let eqNextSlide = $slides.index(self.nextActiveSlide);

            eqActiveSlide < eqNextSlide ? self._setDirection('next') : self._setDirection('prev');
        }

        // присвоение класса активному слайду и управление другим слайдом
        if(self.options.markOnlySlideClick) {
            self._addActiveClassToSlide(numNextSlide);

            if(self.flagControlSlider && self.controlSlider) {
                self.controlSlider.slideTo(numNextSlide, false, self.direction);
            }
        }

        return numNextSlide;
    }

    /**
     * Обработка touch события touchstart
     * @param ev
     * @private
     */
    _handlerTouchStart(ev) {
        let self = this;

        if(self.isAnim) return;
        clearInterval(self.intervalAutoplay);

        self.touchStartEvent = true;

        if(ev.originalEvent.targetTouches.length == 1) {
            let touch = ev.originalEvent.targetTouches[0];

            self.touchStartX = touch.pageX;
            self.touchStartY = touch.pageY;
            self.blockOriginalTouchEvents = undefined;

            self._setTimingFunction(self.$wrapper, 'linear');
            self._setTransitionDuration(self.$wrapper, 0);
        }
    }

    /**
     * Обработка touch события touchend
     * @param ev
     * @private
     */
    _handlerTouchEnd(ev) {
        ev.originalEvent.preventDefault();
        ev.originalEvent.stopPropagation();

        let self = this;

        if(!self.touchStartEvent) return;

        if(ev.originalEvent.changedTouches.length == 1) {
            let touch = ev.originalEvent.changedTouches[0];
            let offset = self.touchStartX - touch.pageX;
            let slideWidth = self.$slides.outerWidth();
            let numNextSlide = self.numActiveSlide;

            // установка дефолтного направления
            self._setDirection('none');

            // проверка были ли заблокированы стандартные touch события
            if(self.blockOriginalTouchEvents !== false) {

                if(offset > 50 || offset < -50) {

                    // определение следующего номера активного слайда
                    if(offset > 0) {
                        numNextSlide = self.numActiveSlide + Math.ceil(offset / slideWidth);

                        if(!self.options.loop) {
                            // корректировка очередности
                            numNextSlide = self._adjustmentSequenceNext(numNextSlide, true);
                        }

                        // установка направления
                        self._setDirection('next');
                    }else{
                        numNextSlide = self.numActiveSlide + Math.floor(offset / slideWidth);

                        if(!self.options.loop) {
                            // корректировка очередности
                            numNextSlide = self._adjustmentSequencePrev(numNextSlide, true);
                        }

                        // установка направления
                        self._setDirection('prev');
                    }

                    // корректировка номера при выходе за границы
                    numNextSlide = self._adjustmentNumNextSlide(numNextSlide);

                }else if(offset < 10 && offset > -10) {

                    // установка функции анимации из настроек
                    self._setTimingFunction(self.$wrapper, self.options.cssEasing);

                    // клик по слайду
                    if(self.options.slideClicked) {
                        $(ev.target).trigger('click');
                    }

                    self.touchStartEvent = false;
                    return;
                }
            }

            self._showNextSlide(numNextSlide, true);
            self.touchStartEvent = false;
            self._startAutoplay();
        }
    }

    /**
     * Корректировка очередности при скроле вперед
     * @param numNextSlide
     * @private
     */
    _adjustmentSequenceNext(numNextSlide, isTouchEvent) {
        let self = this;
        let slideLeftWindow = null;

        if(isTouchEvent) {
            slideLeftWindow = self.translateWrapper / self.$slides.outerWidth();
        }else{
            slideLeftWindow = self.translateWrapper / self.$slides.outerWidth() + self.options.slidesPerScroll;
        }

        if(slideLeftWindow + self.slidesPerView >= self.$slides.length) {
            return self.$slides.length - 1;
        }else{
            return numNextSlide;
        }
    }

    /**
     * Корректировка очередности при скроле назад
     * @param numNextSlide
     * @private
     */
    _adjustmentSequencePrev(numNextSlide, isTouchEvent) {
        let self = this;
        let slideLeftWindow = self.translateWrapper / self.$slides.outerWidth();

        if(slideLeftWindow + self.slidesPerView == self.$slides.length) {

            if(isTouchEvent) {
                return self.$slides.length - self.slidesPerView - (self.numActiveSlide - numNextSlide);
            }else{
                return self.$slides.length - self.slidesPerView - self.options.slidesPerScroll;
            }

        }else{
            return numNextSlide;
        }
    }

    /**
     * Обработка touch события touchmove
     * @param ev
     * @private
     */
    _handlerTouchMove(ev) {
        let self = this;

        // блокировка стандартных событий touch
        if(self.blockOriginalTouchEvents === true) {
            ev.originalEvent.preventDefault();
            ev.originalEvent.stopPropagation();
        }

        if(!self.touchStartEvent || self.blockOriginalTouchEvents === false) return;

        if(ev.originalEvent.targetTouches.length == 1) {
            let touch = ev.originalEvent.targetTouches[0];

            if(self.options.effect == 'carousel') {

                // проверка блокировать ли стандартные touch события
                if(self.blockOriginalTouchEvents === undefined) {
                    if(self.touchStartY - touch.pageY > 50 || self.touchStartY - touch.pageY < -50) {
                        self.blockOriginalTouchEvents = false;
                        return;
                    }else if(self.touchStartX - touch.pageX > 50 || self.touchStartX - touch.pageX < -50) {
                        self.blockOriginalTouchEvents = true;
                    }
                }

                let translate = self.translateWrapper + (self.touchStartX - touch.pageX);

                if(!self.options.loop) {
                    let slidesWidthNotPerView = self.$slides.length * self.slideWidth - self.slidesPerView * self.slideWidth;

                    // корректировка в начале и конце списка слайдов для изменения величины сдвига
                    if(translate < 0) {
                        translate = translate * 0.15;
                    }else if(translate > slidesWidthNotPerView) {
                        translate = (slidesWidthNotPerView) + (translate - (slidesWidthNotPerView)) * 0.15;
                    }
                }

                self._moveWrapper(translate);
                self.translateWrapperTouchmove = translate;
            }
        }
    }

    /**
     * Показ следующего слайда
     * @param num {number} - номер следующего слайда
     * @private
     */
    _showNextSlide(num = this.numActiveSlide, isTouchEvent = false) {
        let self = this;
        let numNextSlide = num;
        let slideWidth = self.$slides.outerWidth();
        let $nextActiveSlide = self.$slides.eq(numNextSlide);
        let duration = self.options.duration;

        // запуск callback
        self.options.onBefore();

        // проверка первоначального срабатывания при инициализации
        self.isStart ? self._setTransitionDuration(self.$wrapper, 0) : self._setTransitionDuration(self.$wrapper, duration);

        // установка задержки для событий
        if(self.options.delayAfterClick) {
            self.isAnim = true;
        }

        // сдвиг карусели
        if(self.options.effect == 'carousel' && !self.sliderSmall) {
            let $activeSlide = self.$slides.eq(self.numActiveSlide); // текущий активный слайд
            let translate = 0;

            // определение следующего активного слайда
            if(self.clickSlide) {
                $nextActiveSlide = self.nextActiveSlide;
            }else{
                if(self.direction == 'prev') {
                    $nextActiveSlide = $activeSlide.prevAll(`[data-num=${numNextSlide}]`).first();
                }else if(self.direction == 'next') {
                    $nextActiveSlide = $activeSlide.nextAll(`[data-num=${numNextSlide}]`).first();
                }
            }

            // определение сдвига
            let eqNextActiveSlide = self.$wrapper.find('.' + self.classes.slide).index($nextActiveSlide);
            translate = eqNextActiveSlide * slideWidth;

            if(!self.options.loop) {
                // корректировка сдвига при достижении конца слайдов для недопущения пустых мест
                if(numNextSlide + self.slidesPerView >= self.$slides.length + 1) {
                    translate = (slideWidth * self.$slides.length) - (slideWidth * self.slidesPerView);
                }
            }else if(self.options.loop) {
                // установка задержки для событий
                self.isAnim = true;

                // проверка активного слайда, что он клон
                setTimeout(() => {
                    if(self.$wrapper.find('.' + self.classes.active).hasClass(self.classes.slideClone)) {
                        let translate = (slideWidth * self.$slides.length) * self.numClone + slideWidth * numNextSlide;
                        self.translateWrapper = translate;

                        // присвоение активного класса
                        self.options.markOnlySlideClick ? undefined : self._addActiveClassToSlide(self.numActiveSlide);

                        self._setTransitionDuration(self.$wrapper, 0);
                        self._moveWrapper(translate);
                    }
                }, self.options.duration + 100);
            }

            // корректировка анимации для touch событий
            if(isTouchEvent) {
                duration = (self.translateWrapperTouchmove - translate) / slideWidth * self.options.duration;
                if(duration < 0) duration = -duration;

                self._setTransitionDuration(self.$wrapper, duration);
                self._setTimingFunction(self.$wrapper, 'ease-out');
            }

            self.translateWrapper = translate;
            self._moveWrapper(translate);
        }

        // присвоение активного класса
        if(!self.options.markOnlySlideClick) {
            self._addActiveClassToSlide($nextActiveSlide);

            // изменение счетчика
            if(self.$counter.length) {
                self.$counter.find('.' + self.classes.counter + '-current').text($nextActiveSlide.data('num') + 1);
            }
        }

        // управление другим слайдером
        if(self.flagControlSlider && self.controlSlider && !self.options.markOnlySlideClick) {
            self.controlSlider.slideTo(numNextSlide, false, self.direction);
        }

        // для touch событий
        if(isTouchEvent) {
            self._setTimingFunction(self.$wrapper, self.options.cssEasing);
        }

        self.numActiveSlide = numNextSlide;
        self.clickSlide = false;
        self.windowWidth = $(window).width();

        self._updateDots();
        self._updateButtons();

        // снятие задержки для режима loop
        setTimeout(() => {self.isAnim = false;}, self.options.duration + 100);

        // запуск callback
        setTimeout(() => self.options.onAfter(), duration);
    }

    /**
     * Сдвиг wrapper
     * @param translate {number} - величина сдвига
     * @private
     */
    _moveWrapper(translate) {
        this.$wrapper.css({
            'transform': 'translate3d(' + (0 - translate) + 'px, 0, 0)',
            '-webkit-transform': 'translate3d(' + (0 - translate) + 'px, 0, 0)'
        });
    }

    /**
     * Показ необходимого слайда
     * @param numNextSlide {number} - номер необходимого слайда
     * @param flagControlSlider {boolean} - управлять ли другим слайдом
     */
    slideTo(numNextSlide, flagControlSlider, direction) {
        let self = this;

        self.flagControlSlider = flagControlSlider;

        // маркировка слайда при маркировке только при клике на слайд
        self.options.markOnlySlideClick ? self._addActiveClassToSlide(numNextSlide) : undefined;

        // установка направления
        direction ? self._setDirection(direction) : self._setDirection(numNextSlide);

        self._showNextSlide(numNextSlide);

        self.flagControlSlider = true;
    }

    /**
     * Обновление точек
     * @private
     */
    _updateDots() {
        let self = this;
        if(!self.controls.$dots) return;

        self.controls.$dots.removeClass(self.classes.active);
        self.controls.$dots.eq(self.numActiveSlide).addClass(self.classes.active);
    }

    /**
     * Обновление кнопок
     * @private
     */
    _updateButtons(numActiveSlide = this.numActiveSlide) {
        let self = this;
        if(self.options.loop || !self.controls.$buttonPrev.length) return;

        let diff = 0;

        // установка смещения если включен режим маркировки активного слайда только по клику на слайд
        self.options.markOnlySlideClick ? diff = self.slidesPerView - 1 : undefined;

        // проверка кнопки назад
        if(numActiveSlide <= 0) {
            self.controls.$buttonPrev.addClass(self.classes.disable);
        }else{
            self.controls.$buttonPrev.removeClass(self.classes.disable);
        }

        // проверка кнопки вперед
        if(numActiveSlide + diff >= self.$slides.length - 1) {
            self.controls.$buttonNext.addClass(self.classes.disable);
        }else{
            self.controls.$buttonNext.removeClass(self.classes.disable);
        }
    }

    /**
     * Установка длительности анимации
     * @param el {jquery} - элемент
     * @param time {number} - время
     * @private
     */
    _setTransitionDuration(el, time) {
        el.css({
            'transition-duration': time + 'ms',
            '-webkit-transition-duration': time + 'ms'
        });
    }

    /**
     * Установка функции анимации
     * @param el {jquery} - элемент
     * @param timingFunction {string} - функция
     * @private
     */
    _setTimingFunction(el, timingFunction) {
        el.css({
            'transition-timing-function': timingFunction,
            '-webkit-transition-timing-function': timingFunction
        });
    }

    /**
     * Определение направления сдвига
     * @param options
     * @private
     */
    _setDirection(options) {
        let self = this;

        if(typeof options == 'number') {
            if(options - self.numActiveSlide > 0) {
                self.direction = 'next';
            }else if(options - self.numActiveSlide < 0) {
                self.direction = 'prev';
            }else if(options - self.numActiveSlide === 0) {
                self.direction = 'none';
            }
        }else {
            self.direction = options;
        }
        self.$container.removeClass('ya-direction-next ya-direction-prev').addClass('ya-direction-' + self.direction);
    }

    /**
     * Определение контролируемого слайдера
     * @param slider {object} - экземпляр класса YaSlider
     */
    setControl(slider) {
        this.controlSlider = slider;
    }

    /**
     * Присвоение класса активному слайду
     * nextSlide {number||jquery}
     * @private
     */
    _addActiveClassToSlide(nextSlide = this.numActiveSlide) {
        let self = this;

        self.$wrapper.find('.' + self.classes.slide).removeClass(self.classes.active);
        if(typeof nextSlide == 'number') {
            self.$wrapper.find(`[data-num=${nextSlide}]`).addClass(self.classes.active);
        }else{
            nextSlide.addClass(self.classes.active);
        }

    }

    /**
     * Корректировка номера слайда при выходе за границы
     * @param numNextSlide
     * @returns {*}
     * @private
     */
    _adjustmentNumNextSlide(numNextSlide) {
        let self = this;
        let newNumNextSlide = numNextSlide;

        if(!self.options.loop) {
            if(numNextSlide < 0) {
                newNumNextSlide = 0;
            }else if(numNextSlide > self.$slides.length - 1) {
                newNumNextSlide = self.$slides.length - 1;
            }
        }else{
            if(numNextSlide > self.$slides.length - 1) {
                newNumNextSlide = (numNextSlide - self.$slides.length);
            }else if(numNextSlide < 0) {
                newNumNextSlide = self.$slides.length + numNextSlide;
            }
        }

        return newNumNextSlide;
    }

    /**
     * Сдвиг wrapper при ресайзе окна браузера, если эффект карусель и слайдер на всю ширину экрана
     * @private
     */
    _moveWrapperResizeWindow() {
        let self = this;
        let slideWidth = self.$slides.outerWidth();
        let translate = self.numActiveSlide * slideWidth;
        if(self.options.loop) {
            translate += self.numClone * self.$slides.length * slideWidth;
        }
        self.translateWrapper = translate;
        self._setTransitionDuration(self.$wrapper, 0);
        self._moveWrapper(translate);
    }
}
