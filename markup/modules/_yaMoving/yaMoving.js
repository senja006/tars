yaModules.yaMoving = (function () {

    let attrForMoving = 'data-moving-target';
    let $elForMoving = $(`[${attrForMoving}]`);

    function moveElement() {
        $elForMoving.each(function() {
            let $el = $(this);
            let $movingTarget = $($el.attr(attrForMoving));

            $movingTarget.append($el);
        });
    }

    return {
        init() {
            if ($elForMoving.length) {
                moveElement();
            }
        }
    }
}());
