/**
* Старт всех модулей после события DOMContentLoaded
*/
function initModules() {
	if(pageReady) {
		
		for(var key in yaModules) {
            yaModules[key].init();
        }

	}else{
		setTimeout(initModules, 100);
	}
};

initModules();