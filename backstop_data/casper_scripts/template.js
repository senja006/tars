module.exports = function (casper, scenario, vp) {
    casper.evaluate(function () {
        $('.ya-tabs__buttons-li').eq(1).find('button').click();
    });

    casper.wait(500);
};
