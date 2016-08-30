module.exports = function (casper, scenario, vp) {
    casper.evaluate(function () {
        var inst = $('[data-remodal-id=modal-callback]').remodal();
        inst.open();
    });

    casper.wait(500);
};