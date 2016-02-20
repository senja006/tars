yaModules.template = (function () {

    let $imgs = $('');
    let defaultOptionsGallery = {
        tClose: 'Закрыть (Esc)',
        tLoading: 'Загрузка изображения #%curr%...',
        delegate: 'a',
        type: 'image',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1], // Will preload 0 - before current, and 1 after the current image
            tPrev: 'Назад (Кнопка влево)',
            tNext: 'Вперед (Кнопка вправо)',
            tCounter: '%curr% из %total%'
        },
        image: {
            tError: '<a href="%url%">Изображение #%curr%</a> не может быть загружено.'
        },
        ajax: {
            tError: '<a href="%url%">Контент</a> не может быть загружен.'
        }
    };
    let defaultOptionsSingle = {
        tClose: 'Закрыть (Esc)',
        tLoading: 'Загрузка изображения #%curr%...',
        ajax: {
            tError: '<a href="%url%">Контент</a> не может быть загружен.'
        },
        type: 'image',
        closeOnContentClick: true,
        mainClass: 'mfp-img-mobile',
        image: {
            tError: '<a href="%url%">Изображение #%curr%</a> не может быть загружено.',
            verticalFit: true
        }
    };

    function initMagnificPopup() {
        $imgs.magnificPopup(defaultOptionsSingle);
    }

    return {
        init() {
            if ($imgs.length) {
                initMagnificPopup();
            }
        }
    }
}());
