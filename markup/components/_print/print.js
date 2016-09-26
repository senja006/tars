yaModules.print = (function () {

    let $printContainer = $('.ya-print');
    let isClone = false;
    let options = {
        attrElementForPrint: 'print-element',
        attrContainerForPrint: 'print-container'
    };

    function addEventListeners() {
        $('.ya-print-button').on('click', startPrint);
    }

    function cloneElements() {
        if(isClone) return;

        isClone = true;
        let $elementsForPrint = $(`[data-${options.attrElementForPrint}]`);
        $elementsForPrint.each(function() {
            let $newEl = $(this).clone();
            let id = $newEl.data(options.attrElementForPrint);
            let $container = $(`[data-${options.attrContainerForPrint}=${id}]`);
            $container.append($newEl);
        });
    }

    function startPrint(ev) {
        ev.preventDefault();
        $printContainer.printArea();
    }

    return {
        init() {
            if ($printContainer.length) {
                cloneElements();
                addEventListeners();
            }
        }
    }
}());
