yaModules.parallax = (function () {

    function initParallax() {
        $parallaxBlocks.each(function() {
            new Parallax({
                element: $(this).find(''),
                ratio: 0.3
            });
        });
    }

    return {
        init() {
            if ($('').length) {
                initParallax();
            }
        }
    }
}());

