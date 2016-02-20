yaModules.yaMetrics = (function () {

    let attrGoals = {
        click: 'data-goal-click',
        submit: 'data-goal-submit'
    };

    function addEventListeners() {
        $(document).on('click', `[${attrGoals.click}]`, function(ev) {
            controlGoal($(ev.target).closest(`[${attrGoals.click}]`));
        });
    }

    function controlGoal(el) {
        let goalName = getGoalName(el);

        reachGoal(goalName);
    }

    function getGoalName(el) {
        let goalName;

        for(let key in attrGoals) {
            goalName = el.attr(attrGoals[key]);
            if(goalName != undefined) {
                break;
            }
        }

        return goalName;
    }

    function reachGoal(goalName, additionalParams) {
        let yandexCounter = window.yaCounter35353510;

        if (typeof yandexCounter !== 'undefined') {
            yandexCounter.reachGoal(goalName, additionalParams);
        }
    }

    return {
        init() {
            if ($(`[${attrGoals.click}]`).length) {
                addEventListeners();
            }
        },
        controlGoal(el) {
            controlGoal(el);
        }
    }
}());
