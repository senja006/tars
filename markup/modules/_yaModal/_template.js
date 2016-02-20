// шаблон на самостоятельное управление открытием и закрытием окна

yaModules. = (function () {

    let buttonOpenModal = '.ya-callback__open'; // изменить класс
    let remodalCallback = undefined; // изменить название переменной
    let remodalClosing = false;

    function addEventListeners() {
        $('html').on('click', buttonOpenModal, toggleRemodal);
    }

    function toggleRemodal() {
        if(!remodalCallback || remodalClosing) return;

        if(remodalCallback.getState() == 'closed') {
            remodalCallback.open();
        }else{
            remodalClosing = true;
            remodalCallback.close();
            setTimeout(() => {
                remodalClosing = false;
            }, 800);
        }
    }

    function createRemodal() {
        try {
            remodalCallback = $('[data-remodal-id=remodal-callback]').remodal(); // изменить id
        }catch(e) {
            setTimeout(() => createRemodal(), 100);
        }
    }

    return {
        init() {
            if ($(buttonOpenModal).length) {
                addEventListeners();
                createRemodal();
            }
        }
    }
}());
