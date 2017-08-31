<?php
add_action( 'sidebar_admin_setup', array( $this, 'upload_scripts' ) );

function upload_scripts() {
	wp_enqueue_media();
	wp_enqueue_script( 'img_upload', get_template_directory_uri() . '/components/img_upload/img_upload.js', array( 'jquery' ) );
}
$preview = ! empty( $instance['preview'] ) ? $instance['preview'] : '';
?>

<div class="logo-upload-preview" style="text-align: center;">
	<?php if ( ! empty( $instance['img_url'] ) ) : ?>
		<div style="display: inline-block; background-color: lightgray; margin: 10px 10px 0;"
		     id="<?php echo $this->get_field_id( 'preview' ); ?>">
			<img src="<?php echo esc_url( $img_url ); ?>">
		</div>
	<?php endif; ?>
</div>
<p>
	<input name="<?php echo $this->get_field_name( 'img_url' ); ?>"
	       id="<?php echo $this->get_field_id( 'img_url' ); ?>"
	       class="widefat" type="hidden" value="<?php echo esc_url( $img_url ); ?>"/>
	<input style="margin-top: 5px;" class="logo-upload-button button button-primary" type="button"
	       value="Выбрать изображение"
	       onclick="imgUpload.uploader('<?php echo $this->get_field_id( 'img_url' ); ?>', '<?php echo $this->get_field_id( 'preview' ); ?>'); return false;"/>
</p>