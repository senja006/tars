yaModules.template = (function () {

    let form = new YaForm('selector');

    function addEventListeners() {
        form.on('submit', controlSendForm);
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
            //     url: '/order-form.php',
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

        }else{
            console.log('Ошибка в форме!');
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
