yaModules.allowCookie = (function () {

    let $cookieInfo = $('.ya-allow-cookie');

    function addEventListeners() {
        $('.ya-allow-cookie__button').on('click', function(ev) {
            ev.preventDefault();

            $cookieInfo.fadeOut('slow');
            setCookie('allowCookie', 'allow', 365);
        });
    }

    function checkAllowCookie() {
        let isAllowCookie = getCookie('allowCookie');
        if (!isAllowCookie) {
            setTimeout(function() {
                $cookieInfo.fadeIn('slow');
            }, 1000);
        }
    }

    function setCookie(name, value, expiry_days) {
        let d = new Date();
        d.setTime(d.getTime() + (expiry_days*24*60*60*1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
        return getCookie(name);
    }

    function getCookie(name) {
        let cookie_name = name + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cookie_name) === 0) {
                return c.substring(cookie_name.length, c.length);
            }
        }
        return false;
    }

    return {
        init() {
            if ($cookieInfo.length) {
                addEventListeners();
                checkAllowCookie();
            }
        }
    }
}());