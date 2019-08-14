yaModules.form = (function () {

    function addEventListeners() {
        $('select').not('.chosen-select').on('change', removeEmptyClass);
    }

    function initPlugins() {
        let $selectsField = $(".chosen-select");
        let $inputsPhoneField = $('[type=tel]');

        if ($selectsField.length) {
            $selectsField.chosen({disable_search_threshold: 100});
        }

        if ($inputsPhoneField.length) {
            $inputsPhoneField.inputmask({"mask": "+7 (999) 999 99 99"});
        }
    }

    function removeEmptyClass() {
        let $select = $(this);

        if ($select.val() === "0") {
            $select.addClass("ya-is-empty");
        } else {
            $select.removeClass("ya-is-empty")
        }
    }

    function validationForm(form) {
        form.find('[data-validation]').each(function () {
            let $field = $(this);
            let type = $field.data('validation');
            let res;

            switch (type) {
                case 'required':
                    res = checkRequired($field);
                    onEventField($field, 'keyup change', checkRequired);
                    break;

                case 'tel':
                    res = checkTel($field);
                    onEventField($field, 'keyup change', checkTel);
                    break;

                case 'checkbox-required':
                    res = checkCheckboxRequired($field);
                    onEventField($field, 'change', checkCheckboxRequired);
                    break;

                case 'select-required':
                    res = checkSelectRequired($field);
                    onEventField($field, 'change', checkSelectRequired);
                    break;

                case 'length':
                    res = checkLength($field);
                    onEventField($field, 'keyup change', checkLength);
                    break;

                case 'password-secondary':
                    res = checkPasswordSecondary($field);
                    onEventField($field, 'keyup change', checkPasswordSecondary);
                    break;

                case 'email':
                    res = checkEmail($field);
                    onEventField($field, 'keyup change', checkEmail);
                    break;
            }

            toggleErrorClass($field, !res);
        });

        return !form.find('.ya-is-error').length;
    }

    function onEventField(field, event, fn) {
        field.on(event, function () {
            toggleErrorClass(field, !fn(field));
        });
    }

    function checkEmail(field) {
        return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(field.val());
    }

    function checkPasswordSecondary(field) {
        return field.val().length > 0 && field.val() === field.parents('form').first().find('[type=password]').first().val();
    }

    function checkLength(field) {
        if (field.data('max-length')) {
            return field.val().length >= field.data('min-length') && field.val().length <= field.data('max-length');
        } else {
            return field.val().length >= field.data('min-length');
        }
    }

    function checkRequired(field) {
        return field.val().length > 0;
    }

    function checkTel(field) {
        return field.val().length > 0 && !field.val().match('_');
    }

    function checkCheckboxRequired(field) {
        return field.find('[type=checkbox]').prop('checked');
    }

    function checkSelectRequired(field) {
        return field.find('select').val() != 0 && field.find('select').val() != null;
    }

    function toggleErrorClass(field, res) {
        field.toggleClass('ya-is-error', res);
    }

    return {
        init() {
            addEventListeners();
            initPlugins();
            $('form').on('submit', function (ev) {
                ev.preventDefault();

                var $form = $(this);
                var res = yaModules.form.validate($form);
            });
        },
        validate(form) {
            return validationForm(form);
        }
    }
}());
