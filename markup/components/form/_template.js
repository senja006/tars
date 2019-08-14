yaModules.template = (function () {

    let form = new YaForm('selector');
    let $checkboxToggleDisableForm = $('[data-toggle-disable-form]');

    function addEventListeners() {
        form.on('submit', controlSendForm);
        $(document).on('change', '[data-file]', checkFile);
        $checkboxToggleDisableForm.on('change', toggleDisableForm);
    }

    function checkFile() {
        let input = this;
        let file = input.files[0];

        if (file.size > 2000000) {
            input.value = '';
            $('.jfilestyle-corner').find('input').val('');
        }
    }

    function controlSendForm(ev) {
        ev.preventDefault();

        if(form.check()) {
            form.disable();
            
            setTimeout(() => {
                form.enable();
                if(true) {
                    console.log('Форма отправлена успешно!');
                    form.showSuccess();
                }else{
                    console.log('Ошибка отправки формы!');
                }
            }, 1000);



            //--- без загрузки файла

            // form.disable();
            // let data = {};
            // let inputs = this.elements;
            // Array.prototype.forEach.call(inputs, function(input) {
            //     if(input.name) {
            //         data[input.name] = input.value;
            //     }
            // });
            // data['action'] = 'send_contacts_form';
            // data['nonce'] = ajaxdata.nonce;

            // let data = $(this).serialize();

            // $.ajax({
            //     url: ajaxdata.url,
            //     type: 'POST',
            //     data: data,
            //     dataType: 'json',
            //     success: function(res) {
            //         if(res.status == 'ok') {
            //             form.showSuccess();
            //             yaModules.yaMetrics.controlGoal(form.getJquery());
            //         }else{
            //             if(res.errors) {
            //                  form.addErrors(res.errors);
            //             }
            //             console.log('Ошибка отправки заявки!');
            //         }
            //         form.enable();
            //     },
            //     error: function() {
            //         console.log('Ошибка в форме!');
            //         form.enable();
            //     }
            // });



            //--- с загрузкой файла

            // let data = new FormData(form.getFormObject());
            // let file = form.getJquery().find('[type=file]')[0].files[0];
            // let inputs = this.elements;

            // data.append('action', 'send_request_form');
            // data.append('nonce', ajaxdata.nonce);
            // data.append('file', file);

            // Array.prototype.forEach.call(inputs, function (input) {
            //     if (input.name && input.type != 'file') {
            //         data.append(input.name, input.value);
            //     }
            // });

            // $.ajax({
            //     url: ajaxdata.url,
            //     type: 'POST',
            //     data: data,
            //     dataType: 'json',
            //     cache: false,
            //     processData: false, // Не обрабатываем файлы (Don't process the files)
            //     contentType: false, // Так jQuery скажет серверу что это строковой запрос
            //     success: function (res) {
            //         if (res.status == 'ok') {
            //             form.showSuccess();
            //         } else {
            //             if (res.errors) {
            //                 form.addErrors(res.errors);
            //             }
            //             // console.log('Ошибка отправки заявки!');
            //         }
            //         form.enable();
            //     },
            //     error: function () {
            //         // console.log('Ошибка в форме!');
            //         form.enable();
            //     }
            // });

        }else{
            console.log('Ошибка в форме!');
        }
    }

    function toggleDisableForm() {
        let $checkbox = $(this);
        let checkboxIsChecked = $checkbox.is(':checked');
        let $buttonSubmit = $checkbox.parents('form').find('[type=submit]');

        if (checkboxIsChecked) {
            $buttonSubmit.prop('disabled', false);
        } else {
            $buttonSubmit.prop('disabled', true);
        }
    }

    return {
        init() {
            if(form.length()) {
                addEventListeners();
            }
        }
    }
}());
