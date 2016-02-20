yaModules.yaModal = (function () {

    let attrBodyModifier = 'data-body-modifier';
    let activeModifiers = [];
    let $body = $('body');

    function addEventListeners() {
        $(document).on('opening', '.remodal', {name: 'opening'}, setBodyModifier);
        $(document).on('opened', '.remodal', {name: 'opened'}, setBodyModifier);
        $(document).on('closing', '.remodal', {name: 'closing'}, setBodyModifier);
        $(document).on('closed', '.remodal', {name: 'closed'}, setBodyModifier);
    }

    function setBodyModifier(ev) {
        let modifiers = $(ev.target).attr(attrBodyModifier).split(' ');
        let str = '-' + ev.data.name;
        let delay = 0;

        removeBodyModifier();

        modifiers.forEach(function(el) {
            activeModifiers.push(el += str);
        });
        $body.addClass(activeModifiers.join(' '));
    }

    function removeBodyModifier() {
        $body.removeClass(activeModifiers.join(' '));
        activeModifiers = [];
    }

    return {
        init() {
            if ($('[' + attrBodyModifier + ']').length) {
                addEventListeners();
            }
        }
    }
}());
