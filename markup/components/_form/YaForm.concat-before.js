/**
 * Класс для управления формами.
 */

class YaForm {

    /**
     * @param form - this или селектор
     *
     * Options:
     * classFieldContainer - контейнер поля ввода
     * classError - класс ошибки
     * classDisabled - класс для заблокированного поля
     * btnShowSuccess - кнопка, которая выводит сообщение об успешной отправке
     * classShowSuccess - класс, присваиваемый сообщению об успешной отправке
     * btnCloseSuccess - кнопка закрытия сообщения об успешной отправке
     * btnShowError - кнопка открытия сообщения об ошибке
     * classShowError - класс, присваиваемый сообщению об ошибке
     * attrRequiredOr - атрибут для проверки одного из обязательных полей
     */
    constructor(form) {
        if (typeof form == 'string') {
            let selector = form + ' form';
            this.form = document.querySelector(selector);
            this.$form = $(selector);
        } else {
            this.form = form;
            this.$form = $(form);
        }
        this.options = {
            classFieldContainer: 'ya-field-container',
            classError: 'ya-error',
            classDisabled: 'ya-disabled',
            btnShowSuccess: 'ya-show-success',
            classShowSuccess: 'ya-show-success',
            btnCloseSuccess: 'ya-close-success',
            btnShowError: 'ya-show-error',
            classShowError: 'ya-show-error',
            attrRequiredOr: 'data-required-or'
        }
    }

    /**
     * Разблокировка поля ввода
     * @param fields {array} - значения атрибутов name полей ввода
     */
    enableFields(fields) {
        let options = this.options;
        let $form = this.$form;

        fields.forEach(function (element, index) {
            let $field = $form.find(`[name=${element}]`);

            $field.prop('disabled', false);
            $field.selectpicker('refresh');
            $field.parents('.' + options.classFieldContainer).removeClass(options.classDisabled);
        });
    }

    /**
     * Блокировка поля ввода
     * @param fields {array} - значения атрибутов name полей ввода
     */
    disableFields(fields) {
        let options = this.options;
        let $form = this.$form;

        fields.forEach(function (element, index) {
            let $field = $form.find(`[name=${element}]`);

            $field.prop('disabled', true);
            $field.selectpicker('refresh');
            $field.parents('.' + options.classFieldContainer).addClass(options.classDisabled);
        });
    }

    /**
     * Устанавливает значение полей ввода
     * @param fields {array} - атрибуты name полей ввода
     * @param value {array} - значения для каждого поля
     */
    setValueFields(fields, value) {
        let $form = this.$form;

        fields.forEach(function (element, index) {
            let currentValue = value.length > 1 ? value[index] : value[0];
            let $field = $form.find(`[name=${element}]`);

            $field.val(currentValue);
            $field.selectpicker('val', currentValue);
        });
    }

    /**
     * Валидация формы.
     * @returns {boolean} - если есть ошибки, то возвращает false, и наоборот.
     */
    check() {
        this._checkRequired();
        this._checkRequiredOr();
        this._checkConfirmPassword();
        this._checkMinLength();
        this._checkTel();

        return this._checkErrorInForm();
    }

    /**
     * Показывает сообщение об успешной отправке. Возможны два варианта: если сообщение - это модальное окно (Bootstrap 3) и отдельный элемент. Если это модальное окно, то необходима скрытая кнопка с соответствующим классом и настроенными атрибутами для закрытия всех модальных окон и вызова необходимого. Если отдельный элемент, то необходимо в data-success атрибуте формы указать селектор сообщения об успешной отправке. Этому сообщению присваивается соотетствующий класс из настроек.
     */
    showSuccess() {
        let $buttonShowSuccess = this.$form.find(`.${this.options.btnShowSuccess}`);
        if ($buttonShowSuccess.length) {
            $buttonShowSuccess.click();
        } else {
            this.$success = $(this.$form.data('success'));
            this.$success.addClass(this.options.classShowSuccess);
            console.log(this.$form);
            this.$form.addClass(this.options.classShowSuccess);

            $(`.${this.options.btnCloseSuccess}`).on('click', (ev) => {
                ev.preventDefault();
                this.$success.removeClass(this.options.classShowSuccess);
                this.$form.removeClass(this.options.classShowSuccess);
            });
        }
    }

    /**
     * Выводит сообщение об ошибке аналогично методу showSuccess(). Атрибут data-error
     */
    showError() {
        let $buttonShowError = this.$form.find(`.${this.options.btnShowError}`);

        if ($buttonShowError.length) {
            $buttonShowError.click();
        } else {
            this.$error = $(this.$form.data('error'));
            this.$error.addClass(this.options.classShowError);
        }
    }

    /**
     * Скрывает сообщение об ошибке
     */
    hideError() {
        let $error = $(this.$form.data('error'));
        $error.removeClass(this.options.classShowError);
    }

    /**
     * Скрывает сообщение об успешной отправке
     */
    hideSuccess() {
        let $success = $(this.$form.data('success'));
        $success.removeClass(this.options.classShowSuccess);
        this.$form.removeClass(this.options.classShowSuccess);
    }

    /**
     * Блокировка отправки формы
     */
    disable() {
        this.$form.find('[type=submit]').prop('disabled', true);
    }

    /**
     * Разблокировка отправки формы
     */
    enable() {
        this.$form.find('[type=submit]').prop('disabled', false);
    }

    /**
     * Сброс формы
     */
    reset() {
        this.$form.trigger('reset');
    }

    /**
     * Проверка обязательных полей на заполнение.
     * @private
     */
    _checkRequired() {
        let $formControls = this.$form.find('[required]');
        let self = this;

        if (!$formControls.length) return;

        $formControls.each(function () {
            let $field = $(this);
            let value = $field.val().replace(/\s+/g, '');

            if (!$field.prop('disabled') && value === '') {
                self._addErrorToField($field);
            } else {
                self._removeErrorFromField($field);
            }
        });
    }

    /**
     * Проверка совпадения пароля
     * @private
     */
    _checkConfirmPassword() {
        let $passwords = this.$form.find('[data-check-confirm]');
        if (!$passwords.length || $passwords.length < 2) return;

        let $fieldPassword = $passwords.eq(0);
        let $fieldConfirmPassword = $passwords.eq(1);

        if ($fieldPassword.val() != $fieldConfirmPassword.val()) {
            $fieldConfirmPassword.val('');
            this._addErrorToField($fieldConfirmPassword);
        }

    }

    /**
     * Проверка минимальной длины
     */
    _checkMinLength() {
        let $fields = this.$form.find('[minlength]');
        let self = this;
        $fields.each(function () {
            let $field = $(this);
            let minLength = $field.attr('minlength');
            if ($field.val().length < minLength) {
                self._addErrorToField($field);
            }
        });
    }

    /**
     * Проверка номера телефона при использовании маски
     */
    _checkTel() {
        let $fields = this.$form.find('[type=tel], [data-type-tel]').filter('[data-inputmask]');
        let self = this;
        $fields.each(function () {
            let $field = $(this);
            if (!$field.val() || $field.val().match('_')) {
                self._addErrorToField($field);
            }
        });
    }

    /**
     * Проверка наличия элементов формы с классом ошибки.
     * @returns {boolean} - если какие-то элементы имеют класс ошибки - false.
     * @private
     */
    _checkErrorInForm() {
        let $errors = this.$form.find(`.${this.options.classError}`);

        return $errors.length ? false : true;
    }

    /**
     * Удаление класса ошибки при вводе в поле.
     * @param field {object} - jQuery объект, поле ввода
     * @private
     */
    _addEventListenersRemoveError(field) {
        field.on('keyup.form change.form', () => {
            this._removeErrorFromField(field);
            field.off('keyup.form change.form');
        });
    }

    /**
     * Добавляет класс ошибки к полю ввода
     * @param field {jQuery}
     * @private
     */
    _addErrorToField(field) {
        let options = this.options;

        field.parents('.' + options.classFieldContainer).addClass(options.classError);
        this._addEventListenersRemoveError(field);
    }

    /**
     * Удаляет ошибку у поля ввода
     * @param field {jQuery}
     * @private
     */
    _removeErrorFromField(field) {
        let options = this.options;

        field.parents('.' + options.classFieldContainer).removeClass(options.classError);
    }

    /**
     * Проверка одного из обязательных полей
     * @private
     */
    _checkRequiredOr() {
        let self = this;
        let $formControls = self.$form.find(`[${self.options.attrRequiredOr}]`);

        if (!$formControls.length) return;

        let $formControlsErrors = [];

        $formControls.each(function () {
            let $field = $(this);
            let value = $field.val().replace(/\s+/g, '');

            if (!$field.prop('disabled') && value === '') {
                $formControlsErrors.push($field);
            }
        });

        if ($formControls.length - $formControlsErrors.length === 0) {
            self._addErrorToField($formControls);
        }
    }

    /**
     * Возвращает объект jquery формы
     * @returns {jQuery}
     */
    getJquery() {
        return this.$form;
    }

    /**
     * Возвращает id формы
     * @returns {string}
     */
    getId() {
        return this.$form.attr('id');
    }

    /**
     * Проверка существования формы
     * @returns {number}
     */
    length() {
        return this.$form.length;
    }

    /**
     * Подписка на события
     * @param event {string} - название события
     * @param cb {function} - вызов обратной функции
     */
    on(event, cb) {
        this.$form.on(event, cb);
    }

    /**
     * Указание на ошибочные поля после проверки на сервере
     */
    addErrors(fieldsNames) {
        let self = this;
        fieldsNames.forEach(function (fieldName) {
            $field = self.$form.find(`[name=${fieldName}]`);
            self._addErrorToField($field);
        });
    }

}
