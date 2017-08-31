<?php

/**
 * Регистрация места размещения виджетов
 */

function register_name_widgets() {
	register_sidebar( array(
		'name'          => 'Имя в админке',
		'id'            => 'header-left',
		'description'   => '',
		'class'         => '',
		'before_widget' => '/components/sidebar/sidebar_before.php',
		'after_widget'  => '/components/sidebar/sidebar_after.php',
		'before_title'  => '',
		'after_title'   => ''
	) );
}

add_action( 'widgets_init', 'register_name_widgets' );

/**
 * Регистрация виджета
 */
class Template_Widget extends WP_Widget {

	public function __construct() {
		$widget_ops = array(
			'description' => 'Описание',
//			'customize_selective_refresh' => true,
		);
		parent::__construct( 'template_widget', 'Заголовок', $widget_ops );

//		if ( is_active_widget( false, false, $this->id_base ) || is_customize_preview() ) {
//			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts_customizer' ) );
//		}
	}

//	public function enqueue_scripts_customizer() {
//		wp_enqueue_script( 'button_customizer', get_template_directory_uri() . '/components/button/button_customizer.js', array(
//				'jquery',
//				'customize-preview'
//		), true );
//	}

	public function widget( $args, $instance ) {
		require TEMPLATEPATH . $args['before_widget'];

		if ( ! empty( $instance['title'] ) && empty( $instance['subtitle'] ) ) {
			echo $args['before_title'] . $instance['title'] . $args['after_title'];
		} elseif ( ! empty( $instance['title'] ) && ! empty( $instance['subtitle'] ) ) {
			echo $args['before_title'] . $instance['title'] . $args['before_subtitle'] . $instance['subtitle'] . $args['after_subtitle'] . $args['after_title'];
		}

		include 'template.php';
		require TEMPLATEPATH . $args['after_widget'];
	}

	public function form( $instance ) {
		$title    = ! empty( $instance['title'] ) ? $instance['title'] : '';
		$subtitle = ! empty( $instance['subtitle'] ) ? $instance['subtitle'] : '';
		$href     = ! empty( $instance['href'] ) ? $instance['href'] : '';
		$color    = ! empty( $instance['color'] ) ? $instance['color'] : 'light-pink';
		$is_responsive = isset( $instance['is_responsive'] ) ? $instance['is_responsive'] : '';

		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>">Заголовок:</label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>"
			       name="<?php echo $this->get_field_name( 'title' ); ?>" type="text"
			       value="<?php echo esc_attr( $title ); ?>"/>
		</p>
		<p><label for="<?php echo $this->get_field_id( 'subtitle' ); ?>">Подзаголовок:</label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'subtitle' ); ?>"
			       name="<?php echo $this->get_field_name( 'subtitle' ); ?>" type="text"
			       value="<?php echo esc_attr( $subtitle ); ?>"/></p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'href' ) ); ?>">Текст:</label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'href' ) ); ?>"
			       name="<?php echo esc_attr( $this->get_field_name( 'href' ) ); ?>" type="href"
			       value="<?php echo esc_attr( $href ); ?>">
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'color' ) ); ?>">Цвет кнопки:</label>
			<select class="widefat" name="<?php echo esc_attr( $this->get_field_name( 'color' ) ); ?>"
			        id="<?php echo esc_attr( $this->get_field_id( 'color' ) ); ?>">
				<option value="light-pink"<?php echo ( $color == 'light-pink' || ! $color ) ? 'selected' : ''; ?>>
					Розовый
				</option>
				<option value="blue"<?php echo ( $color == 'blue' ) ? 'selected' : ''; ?>>Синий</option>
			</select>
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'is_responsive' ); ?>">Трансформировать в мобильное меню?</label>
			<input type="checkbox" id="<?php echo $this->get_field_id( 'is_responsive' ); ?>"
			       name="<?php echo $this->get_field_name( 'is_responsive' ); ?>" <?php echo $is_responsive ? 'checked' : '' ?>>
		</p>
		<?php
		require TEMPLATEPATH . '/components/sidebar/sidebar_form.php';
	}

	public function update( $new_instance, $old_instance ) {
		return $new_instance;
	}
}

add_action( 'widgets_init', function () {
	register_widget( 'Template_Widget' );
} );


/**
 * Customize register
 */

function customize_register_template( $wp_customize ) {
	$wp_customize->add_panel( 'menus', array(
	  'title' => __( 'Menus' ),
	  'description' => $description, // Include html tags such as <p>.
	  'priority' => 160, // Mixed with top-level-section hierarchy.
	) );

	$wp_customize->add_section( 'name_template_section', array(
		'title'    => 'Name section',
		'priority' => 30,
		'panel' => 'menus'
	) );

	$wp_customize->add_setting( 'template_settings', array(
		'default'   => '',
		'transport' => 'refresh', // 'postMessage'
	) );

	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'template_settings',
			array(
				'label'    => 'Label settings',
				'section'  => 'name_template_section',
				'settings' => 'template_settings',
				'priority' => 9
			)
		)
	);

	$wp_customize->add_control(
		new WP_Customize_Control(
			$wp_customize,
			'template_settings',
			array(
				'label'       => 'Label settings',
				'section'     => 'name_template_section',
				'settings'    => 'template_settings',
				'description' => 'Description',
				'priority'    => 9
			)
		)
	);

	$wp_customize->selective_refresh->add_partial( 'contacts_phone', array(
		'selector'        => '.header-addr__list',
		'settings'        => 'contacts_phone',
		'render_callback' => function () {
			$contact_phones = get_contact_phones();

			return get_html_contact_phones( $contact_phones );
		}
	) );

	$pages     = get_pages();
	$pages_arr = array(
		'' => '— Page —'
	);
	foreach ( $pages as $page ) {
		$pages_arr[ $page->ID ] = $page->post_title;
	}
	wp_reset_postdata();

	$wp_customize->add_control(
		new WP_Customize_Control(
			$wp_customize,
			'pages_courses',
			array(
				'label'       => 'Страница курсов',
				'section'     => 'static_front_page',
				'settings'    => 'pages_courses',
				'description' => 'Эта страница выводит курсы',
				'type'        => 'select',
				'choices'     => $pages_arr
			)
		)
	);
}

add_action( 'customize_register', 'customize_register_template' );


/**
 * Новый тип записи
 */

function register_post_type_template() {
	$args = array(
		'label'               => null,
		'labels'              => array(
			'name'               => 'Социальные сети',
			'singular_name'      => 'Социальная сеть',
			'add_new'            => 'Добавить новую',
			'add_new_item'       => 'Добавить новую социальную сеть',
			'edit_item'          => 'Редактировать социальную сеть',
			'new_item'           => 'Новая социальная сеть',
			'view_item'          => 'Посмотреть социальную сеть',
			'search_items'       => 'Найти социальную сеть',
			'not_found'          => 'Социальные сети не найдены',
			'not_found_in_trash' => 'Социальные сети в корзине не найдены',
			'parent_item_colon'  => '',
			'menu_name'          => 'Соц. сети'
		),
		'description'         => '',
		'public'              => true,
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_position'       => null,
		'menu_icon'           => 'dashicons-share',
		'hierarchical'        => false,
		'supports'            => array( 'title', 'editor', 'thumbnail' ),
		'taxonomies'          => array(),
		'has_archive'         => false,
		'rewrite'             => false,
		'query_var'           => true,
		'show_in_nav_menus'   => false,
	);

	register_post_type( 'template', $args );
}

function post_type_messages_template( $messages ) {
	global $post, $post_ID;

	$messages['template'] = array(
		0  => '', // Данный индекс не используется.
		1  => 'Социальная сеть обновлена.',
		2  => 'Параметр обновлён.',
		3  => 'Параметр удалён.',
		4  => 'Социальная сеть обновлена.',
		5  => isset( $_GET['revision'] ) ? sprintf( 'Социальная сеть восстановлена из редакции: %s', wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		6  => sprintf( 'Функция опубликована на сайте. <a href="%s">Просмотр</a>', esc_url( get_permalink( $post_ID ) ) ),
		7  => 'Социальная сеть сохранена.',
		8  => sprintf( 'Отправлено на проверку. <a target="_blank" href="%s">Просмотр</a>', esc_url( add_query_arg( 'preview', 'true', get_permalink( $post_ID ) ) ) ),
		9  => sprintf( 'Запланировано на публикацию: <strong>%1$s</strong>', date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) ) ),
		10 => 'Черновик обновлён.'
	);

	return $messages;
}

add_action( 'init', 'register_post_type_template' );
add_filter( 'post_updated_messages', 'post_type_messages_template' );

/**
 * Регистрация таксономии
 */

function create_taxonomy_template() {
	// заголовки
	$labels = array(
		'name'              => 'Категории',
		'singular_name'     => 'Категория',
		'search_items'      => 'Поиск категории',
		'all_items'         => 'Все категории',
		'parent_item'       => 'Родительская категория',
		'parent_item_colon' => 'Родительская категория:',
		'edit_item'         => 'Редактировать категорию',
		'update_item'       => 'Обновить категорию',
		'add_new_item'      => 'Добавить категорию',
		'new_item_name'     => 'Добавить категорию',
		'menu_name'         => 'Категории',
	);
	// параметры
	$args = array(
		'label'                 => '',
		'labels'                => $labels,
		'description'           => '',
		'public'                => true,
		'publicly_queryable'    => null,
		'show_in_nav_menus'     => true,
		'show_ui'               => true,
		'show_tagcloud'         => true,
		'hierarchical'          => true, // обязательно true. иначе будут проблемы
		'update_count_callback' => '',
		'rewrite'               => true,
//		'query_var'             => $taxonomy, // название параметра запроса
		'capabilities'          => array(),
		'meta_box_cb'           => null,
		'show_admin_column'     => true,
		'_builtin'              => false,
		'show_in_quick_edit'    => null,
	);
	register_taxonomy( 'category_template', array(), $args );
}

add_action( 'init', 'create_taxonomy_template' );


/**
 * Вывод дополнительных столбцов на админ экран и добавление сортировки
 */
function add_new_service_columns( $columns ) {
	$columns['cost'] = 'Стоимость';

	return $columns;
}

function show_content_service_columns( $column_name, $post_ID ) {
	if ( $column_name == 'cost' ) {
		$cost = get_field( 'cost' );
		echo $cost ? $cost : 0;
	}
}

function manage_wp_posts_service_sortable( $query ) {
	if ( $query->is_main_query() && ( $orderby = $query->get( 'orderby' ) ) ) {
		switch ( $orderby ) {
			case 'Сортировка':
				$query->set( 'meta_key', 'sort' );
				$query->set( 'orderby', 'meta_value_num' );
				break;
		}
	}
}


add_filter( 'manage_service_posts_columns', 'add_new_service_columns' );
add_action( 'manage_service_posts_custom_column', 'show_content_service_columns', 10, 2 );

add_filter( 'manage_edit-service_sortable_columns', 'add_new_service_columns' );
add_action( 'pre_get_posts', 'manage_wp_posts_service_sortable', 1 );


/**
 * Обработка формы
 */

function send_template_form() {
	global $is_debug_mode;
	global $email_debug_mode;

	$nonce = $_POST['nonce'];
	$name  = wp_strip_all_tags( $_POST['name'] );
	$email = sanitize_email( $_POST['email'] );
	$attachment = null;
	$movefile = null;

	if ( ! wp_verify_nonce( $nonce, 'ajax_for_my_site' ) ) {
		$data['status'] = 'false';

		echo json_encode( $data );

		wp_die();
	}

	if ( $_FILES['file'] ) {
		$file      = &$_FILES['file'];
		$overrides = array( 'test_form' => false );

		$movefile = wp_handle_upload( $file, $overrides );

		if ( $movefile ) {
			$attachment = $movefile['file'];
		}
	}

	$required_fields = array(
		'surname'      => $surname,
	);

	foreach ( $required_fields as $name=>$value ) {
		if ( empty( $value ) ) {
			$data['errors'][] = $name;
		}
	}

	if ( ! is_email( $email ) ) {
		$data['errors'][] = 'email';
	}

	if ( ! isset( $data['errors'] ) ) {
		$subscriber = new WP_Query( array(
			'post_type'  => 'subscriber',
			'post_status' => 'publish',
			'meta_query' => array(
				array(
					'key'   => 'email',
					'value' => $email
				)
			)
		) );

		if ( $subscriber->have_posts() ) {
			$data['status'] = 'ok';
			echo json_encode( $data );
			wp_die();
		}

		$post_id = wp_insert_post( array(
			'post_title'  => $name,
			'post_status' => 'publish',
			'post_type'   => 'subscriber'
		) );

		if ( ! $post_id ) {
			$data['status'] = 'false';
			echo json_encode( $data );
			wp_die();
		} else {
			update_field( 'field_579b5ec84b84d', $email, $post_id );
		}

		$email_to   = $is_debug_mode ? $email_debug_mode : get_theme_mod( 'email_to' );
		$subject    = get_theme_mod( 'subscription_subject' );
		$email_body = 'Имя: ' . $name . '<br><br>';
		$email_body .= 'Email: ' . $email . '<br><br>';

		if ( wp_mail( $email_to, $subject, $email_body, null, $attachment ) ) {
			$data['status'] = 'ok';
		} else {
			$data['status'] = 'false';
		}
	}

	unlink($movefile['file']);

	echo json_encode( $data );

	wp_die();
}

add_action( 'wp_ajax_send_template_form', 'send_template_form' );
add_action( 'wp_ajax_nopriv_send_template_form', 'send_template_form' );


/**
 * Количество записей на странице
 */
function set_posts_per_page_in_template( $query ) {
	if ( is_tax( 'name_category' ) || is_post_type_archive( 'name_type_post' ) && ! is_admin() && $query->is_main_query() ) {
		$query->set( 'posts_per_page', get_theme_mod( 'name_mod' ) );
	}

	return $query;
}

add_filter( 'pre_get_posts', 'set_posts_per_page_in_template' );


/**
 * Настройка изображений
 */

function set_image_size_template() {
	add_image_size( 'template_name', 984, 300 );
}

add_action( 'after_setup_theme', 'set_image_size_template' );
//echo wp_get_attachment_image_src( get_field( 'course_info_bg_img' ), 'course_info_bg' )[0];
//echo wp_get_attachment_image_url( $id, 'name_size' );


/**
 * Добавление опции к выбору размера изображения при добавлении в запись
 */
function set_names_choose_template( $sizes ) {
	return array_merge( $sizes, array(
		'template_name' => 'Название',
	) );
}

add_filter( 'image_size_names_choose', 'set_names_choose_template' );


/**
 * Уведомление в админке
 */
function my_notification() {
	echo ' <div class="error">
	<p>Мы собираемся перевести сайт в режим технических работ. Пожалуйста, не делайте никаких изменений до 18:00.</p>
	</div>';
}
add_action( 'admin_notices', ' my_notification ' );


/**
 * Добавление собственных параметров запроса
 */

function register_template_query_vars( $vars ) {
	$vars[] = 'name';

	return $vars;
}

add_filter( 'query_vars', 'register_template_query_vars' );

/**
 * Minimizing list of content blocks (сворачивание компонентов карбона)
 */
add_action( 'admin_print_scripts', function () {
	echo '<script>';
	echo ';(function() {
			document.addEventListener("DOMContentLoaded", function() {
		        setTimeout(
		            function() {
		                jQuery(".wp-admin .carbon-group-row .carbon-btn-collapse").click();
		            }, 1000
		        );
			});
		}())';
	echo '</script>';
} );

/**
 * Add svg size in editor
 */
add_filter( 'tiny_mce_before_init', function ( $mceInit ) {
	$styles = 'img[src*=\'.svg\'] { width: auto !important; height: auto !important; }';

	if ( isset( $mceInit['content_style'] ) ) {
		$mceInit['content_style'] .= ' ' . $styles . ' ';
	} else {
		$mceInit['content_style'] = $styles . ' ';
	}

	return $mceInit;
} );

/**
 * Load text domain
 */
load_theme_textdomain( 'name', get_template_directory() . '/languages' );
