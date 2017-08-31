jQuery(document).ready(function ($) {

    imgUpload = {

        uploader: function (idInputUrl, idContainerImg) {

            var frame = wp.media({
                title: 'Выберите изображение',
                multiple: false,
                library: {type: 'image'},
                button: {text: 'Выбрать'}
            });

            frame.on('select', function () {
                var attachment = frame.state().get('selection').first().toJSON();
                $('#' + idContainerImg).empty().html(imgUpload.imgHTML(attachment));
                $('#' + idInputUrl).val(attachment.url);
            });

            frame.open();
            return false;
        },

        imgHTML: function (attachment) {
            var img_html = '<img src="' + attachment.url + '" ';
            img_html += 'width="' + attachment.width + '" ';
            img_html += 'height="' + attachment.height + '" ';
            if (attachment.alt != '') {
                img_html += 'alt="' + attachment.alt + '" ';
            }
            img_html += 'style="max-width: 100%" ';
            img_html += '/>';
            return img_html;
        }
    };
});