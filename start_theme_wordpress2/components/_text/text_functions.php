<?php

/**
 * Регистрация виджета
 */
class Text_Widget extends WP_Widget {

	public function __construct() {
		$widget_ops = array(
			'description' => 'Текст или html'
		);
		parent::__construct( 'text_widget', 'Текст', $widget_ops );
	}

	public function widget( $args, $instance ) {
		require TEMPLATEPATH . $args['before_widget'];
		include 'text_widget.php';
		require TEMPLATEPATH . $args['after_widget'];
	}

	public function form( $instance ) {
		$reset_typography_styles = ! empty( $instance['reset_typography_styles'] ) ? $instance['reset_typography_styles'] : '';
		$text                    = ! empty( $instance['text'] ) ? $instance['text'] : '';
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'text' ); ?>">Текст:</label>
			<textarea class="widefat" id="<?php echo $this->get_field_id( 'text' ); ?>"
			          name="<?php echo $this->get_field_name( 'text' ); ?>"
			          rows="8"><?php echo esc_attr( $text ); ?></textarea>
		</p>
		<p>
			<input type="checkbox" id="<?php echo $this->get_field_id( 'reset_typography_styles' ); ?>"
			       name="<?php echo $this->get_field_name( 'reset_typography_styles' ); ?>"
			       value="ya-reset-typography-styles" <?php checked( $reset_typography_styles, 'ya-reset-typography-styles' ); ?>>
			<label for="<?php echo $this->get_field_id( 'reset_typography_styles' ); ?>">сброс стилей для основного
				текста</label>
		</p>
		<?php
		require TEMPLATEPATH . '/components/sidebar/sidebar_form.php';
	}

	public function update( $new_instance, $old_instance ) {
		return $new_instance;
	}
}

add_action( 'widgets_init', function () {
	register_widget( 'Text_Widget' );
} );

/**
 * Новый компонент acf flexible
 */

$components_acf[] = array(
	'key'        => '57d7928e53045',
	'name'       => 'text',
	'label'      => 'Текст',
	'display'    => 'block',
	'sub_fields' => array(
		array(
			'key'               => 'field_57d7932ae6621',
			'label'             => 'Колонки',
			'name'              => 'cols_list',
			'type'              => 'repeater',
			'instructions'      => '',
			'required'          => 0,
			'conditional_logic' => 0,
			'wrapper'           => array(
				'width' => '',
				'class' => '',
				'id'    => '',
			),
			'min'               => '',
			'max'               => '',
			'layout'            => 'table',
			'button_label'      => 'Добавить колонку',
			'sub_fields'        => array(
				array(
					'key'               => 'field_57d799a4e6622',
					'label'             => 'Текст',
					'name'              => 'text',
					'type'              => 'wysiwyg',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'default_value'     => '',
					'tabs'              => 'all',
					'toolbar'           => 'full',
					'media_upload'      => 1,
				),
			),
		)
	)
);
