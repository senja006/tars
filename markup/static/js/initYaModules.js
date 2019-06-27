/**
 * Init all modules after DOMContentLoaded event
 */
(function initModules() {
    if (pageReady) {

        for (var key in yaModules) {
            if (yaModules[key].init) yaModules[key].init();
        }

        if (scriptsForLoad.length) {
            scriptsForLoad.forEach(function (url) {
                let script = document.createElement('script');

                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', url);
                document.body.appendChild(script);
            });
        }

    } else {
        setTimeout(initModules, 100);
    }
})();
