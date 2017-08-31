<?php

/**
 * Виджет логотипа
 */
class Logo_Widget extends WP_Widget {

	public function __construct() {
		$widget_ops = array(
			'description' => 'Логотип сайта',
		);
		parent::__construct( 'logo_widget', 'Логотип', $widget_ops );
		add_action( 'admin_enqueue_scripts', array( $this, 'upload_scripts' ) );
	}

	public function upload_scripts() {
		wp_enqueue_script( 'media-upload' );
		wp_enqueue_script( 'thickbox' );
		wp_enqueue_script( 'upload_media_widget', get_template_directory_uri() . '/components/logo/logo_upload_media.js', array( 'jquery' ) );
		wp_enqueue_style( 'thickbox' );
	}

	public function widget( $args, $instance ) {
		require TEMPLATEPATH . $args['before_widget'];
		include 'logo.php';
		require TEMPLATEPATH . $args['after_widget'];
	}

	public function form( $instance ) {
		$img   = ! empty( $instance['img'] ) ? $instance['img'] : '';
		$width = ! empty( $instance['width'] ) ? $instance['width'] : '';

		?>
		<p>
			<label for="<?php echo $this->get_field_name( 'img' ); ?>">Изображение:</label>
			<input name="<?php echo $this->get_field_name( 'img' ); ?>" id="<?php echo $this->get_field_id( 'img' ); ?>"
			       class="widefat" type="text" value="<?php echo esc_url( $img ); ?>"/>
			<input style="margin-top: 5px;" class="upload_image_button button button-primary" type="button"
			       value="Выбрать изображение"/>
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'width' ); ?>">Ширина:</label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'width' ); ?>"
			       name="<?php echo $this->get_field_name( 'width' ); ?>" type="text"
			       value="<?php echo esc_attr( $width ); ?>" required/>
		</p>
		<?php
		require TEMPLATEPATH . '/components/sidebar/sidebar_form.php';
	}

	public function update( $new_instance, $old_instance ) {
		return $new_instance;
	}
}

add_action( 'widgets_init', function () {
	register_widget( 'Logo_Widget' );
} );