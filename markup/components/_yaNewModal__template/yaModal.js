yaModules.yaModal = (function () {

    let $modals = $('.ya-modal-wrapper');

    function addEventListeners() {
        new YaModal($modals);
    }

    return {
        init() {
            if ($modals.length) {
                addEventListeners();
            }
        }
    }
}());
