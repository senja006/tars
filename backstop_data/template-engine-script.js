module.exports = async (page, scenario, vp) => {
    console.log('SCENARIO > ' + scenario.label);
    await require('./puppet/clickAndHoverHelper')(page, scenario);

    var selector = '[id="mobile-menu-main"]';
    await page.waitForSelector(selector, {"timeout":300000});
    await page.click(selector);
    await page.waitForFunction("document.readyState == 'complete'", {"timeout":300000});
};
