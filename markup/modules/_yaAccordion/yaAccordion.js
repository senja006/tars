yaModules.yaAccordion = (function () {

    function addEventListeners() {
        $(document).on('accordion.open', '.accordion', {myEvent: 'open'}, setTextButtonAccordionOpen);
        $(document).on('accordion.close', '.accordion', {myEvent: 'close'}, setTextButtonAccordionOpen);
    }

    function initAccordion() {
        $('.accordion').accordion({
            transitionSpeed: 400,
            singleOpen: false
        });
    }

    function setTextButtonAccordionOpen(ev) {
        let $accordion = $(this);
        let $buttonAccordionOpen = $accordion.children('.ya-accordion__open');

        if(!$buttonAccordionOpen.length) return;

        let text = $buttonAccordionOpen.data('text-' + ev.data.myEvent);
        $buttonAccordionOpen.find('.ya-accordion__open-text').text(text);
    }

    return {
        init() {
            if ($('[data-accordion]').length) {
                initAccordion();
                addEventListeners();
            }
        }
    }
}());
