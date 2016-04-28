/**
 * Старт всех модулей после события DOMContentLoaded
 */
function initModules() {
    if(pageReady) {

        for(var key in yaModules) {
            if(yaModules[key].init) yaModules[key].init();
        }

        if(scriptsForLoad.length) {
            scriptsForLoad.forEach(function(el) {
                $.getScript(el);
            });
        }

    }else{
        setTimeout(initModules, 100);
    }
}

initModules();
