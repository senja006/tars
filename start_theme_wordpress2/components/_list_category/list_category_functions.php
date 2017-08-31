<?php

/**
 * Регистрация виджета
 */
class List_Category_Widget extends WP_Widget {

	public function __construct() {
		$widget_ops = array(
			'description'                 => 'Выводит список категорий выбранного типа записи',
			'customize_selective_refresh' => true,
		);
		parent::__construct( 'list_category_widget', 'Список категорий', $widget_ops );
	}

	public function widget( $args, $instance ) {
		echo $args['before_widget'];

		if ( ! empty( $instance['title'] ) && empty( $instance['subtitle'] ) ) {
			echo $args['before_title'] . $instance['title'] . $args['after_title'];
		} elseif ( ! empty( $instance['title'] ) && ! empty( $instance['subtitle'] ) ) {
			echo $args['before_title'] . $instance['title'] . $args['before_subtitle'] . $instance['subtitle'] . $args['after_subtitle'] . $args['after_title'];
		}

		include 'list_category.php';
		echo $args['after_widget'];
	}

	public function form( $instance ) {
		$title            = ! empty( $instance['title'] ) ? $instance['title'] : '';
		$subtitle         = ! empty( $instance['subtitle'] ) ? $instance['subtitle'] : '';
		$select_post_type = ! empty( $instance['select_post_type'] ) ? $instance['select_post_type'] : 'post';

		$post_types = array(
			array(
				'name' => 'Записи блога',
				'type' => 'post/category'
			),
			array(
				'name' => 'Курсы',
				'type' => 'course/category_course'
			)
		);
		?>
		<p><label for="<?php echo $this->get_field_id( 'title' ); ?>">Заголовок:</label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>"
			       name="<?php echo $this->get_field_name( 'title' ); ?>" type="text"
			       value="<?php echo esc_attr( $title ); ?>"/></p>
		<p><label for="<?php echo $this->get_field_id( 'subtitle' ); ?>">Подзаголовок:</label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'subtitle' ); ?>"
			       name="<?php echo $this->get_field_name( 'subtitle' ); ?>" type="text"
			       value="<?php echo esc_attr( $subtitle ); ?>"/></p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'select_post_type' ) ); ?>">Тип записи:</label>
			<select class="widefat" name="<?php echo esc_attr( $this->get_field_name( 'select_post_type' ) ); ?>"
			        id="<?php echo esc_attr( $this->get_field_id( 'select_post_type' ) ); ?>">
				<?php foreach ( $post_types as $post_type ) : ?>
					<option
						value="<?php echo $post_type['type']; ?>"<?php echo ( $select_post_type == $post_type['type'] || ! $select_post_type ) ? 'selected' : ''; ?>>
						<?php echo $post_type['name']; ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>
		<?php
	}

	public function update( $new_instance, $old_instance ) {
		return $new_instance;
	}
}

add_action( 'widgets_init', function () {
	register_widget( 'List_Category_Widget' );
} );