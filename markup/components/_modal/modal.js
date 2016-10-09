yaModules.modal = (function () {

    let remodals = {};

    function addEventListeners() {
        $('[data-nested-remodal-target]').on('click', openNestedRemodal);
        $(document).on('opened', '.remodal', unBlockOverlay);
    }

    function openNestedRemodal(ev, remodalTargetId) {
        let idRemodal = remodalTargetId;

        if(ev) {
            ev.preventDefault();

            idRemodal = $(this).data('nested-remodal-target');
        }

        createRemodal(idRemodal);
        $('.remodal-overlay').addClass('is-block');
        remodals[idRemodal].remodal.open();
    }

    function unBlockOverlay() {
        console.log('unblock');
        $('.remodal-overlay').removeClass('is-block');
    }

    function openRemodal(idRemodal, onlyOverlay) {
        createRemodal(idRemodal);

        if (onlyOverlay) {
            remodals[idRemodal].$remodal.parents('.remodal-wrapper').css({
                zIndex: 31
            });
        }

        remodals[idRemodal].remodal.open();
    }

    function closeRemodal(idRemodal) {
        createRemodal(idRemodal);
        remodals[idRemodal].remodal.close();
    }

    function createRemodal(idRemodal) {
        if (!remodals[idRemodal]) {
            let $remodal = $(`[data-remodal-id=${idRemodal}]`);
            remodals[idRemodal] = {
                $remodal: $remodal,
                remodal: $remodal.remodal()
            };
        }
    }

    return {
        init() {
            addEventListeners();
        },
        openRemodal(idRemodal, onlyOverlay = false) {
            openRemodal(idRemodal, onlyOverlay);
        },
        openNestedRemodal(remodalTargetId) {
            openNestedRemodal(null, remodalTargetId);
        },
        closeRemodal(idRemodal) {
            closeRemodal(idRemodal);
        }
    };
}());
