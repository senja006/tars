<?php

/**
 * Регистрация виджета меню
 */
class Menu_Widget extends WP_Widget {

	public function __construct() {
		$widget_ops = array(
			'description'                 => 'Добавьте меню',
			'customize_selective_refresh' => true,
		);
		parent::__construct( 'menu_widget', 'Меню', $widget_ops );
	}

	public function widget( $args, $instance ) {
		// Get menu
		$nav_menu = ! empty( $instance['nav_menu'] ) ? wp_get_nav_menu_object( $instance['nav_menu'] ) : false;

		if ( ! $nav_menu ) {
			return;
		}

		require TEMPLATEPATH . $args['before_widget'];

		$nav_menu_args = array(
			'fallback_cb' => '',
			'menu'        => $nav_menu,
			'container'   => false,
			'menu_class'  => 'ya-menu__list-ul',
			'walker'      => new Ya_Menu()
		);

		include 'menu.php';

		require TEMPLATEPATH . $args['after_widget'];
	}

	public function form( $instance ) {
		$nav_menu = isset( $instance['nav_menu'] ) ? $instance['nav_menu'] : '';

		// Get menus
		$menus = wp_get_nav_menus();

		// If no menus exists, direct the user to go and create some.
		?>
		<p class="nav-menu-widget-no-menus-message" <?php if ( ! empty( $menus ) ) {
			echo ' style="display:none" ';
		} ?>>
			<?php
			if ( isset( $GLOBALS['wp_customize'] ) && $GLOBALS['wp_customize'] instanceof WP_Customize_Manager ) {
				$url = 'javascript: wp.customize.panel( "nav_menus" ).focus();';
			} else {
				$url = admin_url( 'nav-menus.php' );
			}
			?>
			<?php echo sprintf( __( 'No menus have been created yet. <a href="%s">Create some</a>.' ), esc_attr( $url ) ); ?>
		</p>
		<div class="nav-menu-widget-form-controls" <?php if ( empty( $menus ) ) {
			echo ' style="display:none" ';
		} ?>>
			<p>
				<label for="<?php echo $this->get_field_id( 'nav_menu' ); ?>"><?php _e( 'Select Menu:' ); ?></label>
				<select class="widefat" id="<?php echo $this->get_field_id( 'nav_menu' ); ?>"
				        name="<?php echo $this->get_field_name( 'nav_menu' ); ?>">
					<option value="0"><?php _e( '&mdash; Select &mdash;' ); ?></option>
					<?php foreach ( $menus as $menu ) : ?>
						<option
							value="<?php echo esc_attr( $menu->term_id ); ?>" <?php selected( $nav_menu, $menu->term_id ); ?>>
							<?php echo esc_html( $menu->name ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</p>
		</div>
		<?php
	}

	public function update( $new_instance, $old_instance ) {
		return $new_instance;
	}
}

add_action( 'widgets_init', function () {
	register_widget( 'Menu_Widget' );
} );


/**
 * Класс формирования меню
 */
class Ya_Menu extends Walker_Nav_Menu {

	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		$classes[] = 'ya-menu__list-li';

		$args = apply_filters( 'nav_menu_item_args', $args, $item, $depth );

		$class_names         = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
		$activeMenuItemClass = ( in_array( 'current-menu-item', $item->classes ) || in_array( 'current-menu-parent', $item->classes ) ) ? ' ya-active' : '';
		$class_names         = $class_names ? ' class="' . esc_attr( $class_names ) . $activeMenuItemClass . '"' : '';

		$id = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		$output .= $indent . '<li' . $id . $class_names . '>';

		$atts           = array();
		$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
		$atts['target'] = ! empty( $item->target ) ? $item->target : '';
		$atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';
		$atts['href']   = ! empty( $item->url ) ? $item->url : '';

		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( ! empty( $value ) && ! in_array( 'current-menu-item', $item->classes ) && 'href' === $attr ) {
				$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$attributes .= ' ' . $attr . '="' . $value . '"';
			}
		}

		/** This filter is documented in wp-includes/post-template.php */
		$title = apply_filters( 'the_title', $item->title, $item->ID );

		$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

		$item_output = $args->before;
		$item_output .= '<a class="ya-menu__list-text"' . $attributes . '>';
		$item_output .= $args->link_before . $title . $args->link_after;
		$item_output .= '</a>';
		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}

	public function end_el( &$output, $item, $depth = 0, $args = array() ) {
		$output .= "</li>\n";
	}

	public function start_lvl( &$output, $depth = 0, $args = array() ) {
		$indent = str_repeat( "\t", $depth );
		$output .= "\n$indent<ul class=\"ya-menu__list-ul\">\n";
	}

}

function custom_active_menu( $classes, $item ) {

	/**
	 * Для вывода записей блога
	 */
	if ( is_category() || is_singular( 'post' ) ) {
		if ( get_option( 'page_for_posts' ) == $item->object_id ) {
			$classes[] = 'ya-active';
		}
	}

	/**
	 * Для вывода курсов
	 */
	if ( ( is_tax( 'category_course' ) ) || is_singular( 'course' ) ) {
		$title_page_in_menu = $item->title;
		$page_courses_id    = get_theme_mod( 'pages_courses' );
		$pages              = get_pages();
		wp_reset_postdata();

		foreach ( $pages as $post ) {
			if ( $post->ID == $page_courses_id && $post->post_title == $title_page_in_menu ) {
				$classes[] = 'ya-active';
			}
		}
	}

	return $classes;
}

add_filter( 'nav_menu_css_class', 'custom_active_menu', 10, 2 );


/**
 * Регистрация кастомных полей для пунктов меню
 * Доступ к этому полю в кастомном классе walker осуществляется $item->visible_only_mobile
 * https://www.smashingmagazine.com/2015/10/customize-tree-like-data-structures-wordpress-walker-class/
 */

function custom_nav_menu_item( $item ) {
	$item->visible_only_mobile = get_post_meta( $item->ID, '_menu-item-visible-only-mobile', true );

	return $item;
}

// add_filter( 'wp_setup_nav_menu_item', 'custom_nav_menu_item' );


/**
 * Сохранение кастомных полей
 */

function custom_update_nav_menu_item( $menu_id, $menu_item_db_id, $menu_item_args ) {
	$menu_item_args['menu-item-visible-only-mobile'] = isset($_POST['menu-item-visible-only-mobile'][ $menu_item_db_id ]) ? $_POST['menu-item-visible-only-mobile'][ $menu_item_db_id ] : '';
	update_post_meta( $menu_item_db_id, '_menu-item-visible-only-mobile', sanitize_key($menu_item_args['menu-item-visible-only-mobile'] ));
//		update_post_meta( $menu_item_db_id, '_menu-item-visible-only-mobile', sanitize_html_class( $menu_item_args['menu-item-visible-only-mobile'] ) );
}

// add_action( 'wp_update_nav_menu_item', 'custom_update_nav_menu_item', 10, 3 );


/**
 * Кастомный класс редактирования пунктов меню
 */
require_once $_SERVER['DOCUMENT_ROOT'] . '/wp-admin/includes/class-walker-nav-menu-edit.php';

class Custom_Walker_Nav_Menu_Edit extends Walker_Nav_Menu_Edit {

	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		global $_wp_nav_menu_max_depth;
		$_wp_nav_menu_max_depth = $depth > $_wp_nav_menu_max_depth ? $depth : $_wp_nav_menu_max_depth;

		ob_start();
		$item_id      = esc_attr( $item->ID );
		$removed_args = array(
			'action',
			'customlink-tab',
			'edit-menu-item',
			'menu-item',
			'page-tab',
			'_wpnonce',
		);

		$original_title = '';
		if ( 'taxonomy' == $item->type ) {
			$original_title = get_term_field( 'name', $item->object_id, $item->object, 'raw' );
			if ( is_wp_error( $original_title ) ) {
				$original_title = false;
			}
		} elseif ( 'post_type' == $item->type ) {
			$original_object = get_post( $item->object_id );
			$original_title  = get_the_title( $original_object->ID );
		} elseif ( 'post_type_archive' == $item->type ) {
			$original_object = get_post_type_object( $item->object );
			if ( $original_object ) {
				$original_title = $original_object->labels->archives;
			}
		}

		$classes = array(
			'menu-item menu-item-depth-' . $depth,
			'menu-item-' . esc_attr( $item->object ),
			'menu-item-edit-' . ( ( isset( $_GET['edit-menu-item'] ) && $item_id == $_GET['edit-menu-item'] ) ? 'active' : 'inactive' ),
		);

		$title = $item->title;

		if ( ! empty( $item->_invalid ) ) {
			$classes[] = 'menu-item-invalid';
			/* translators: %s: title of menu item which is invalid */
			$title = sprintf( __( '%s (Invalid)' ), $item->title );
		} elseif ( isset( $item->post_status ) && 'draft' == $item->post_status ) {
			$classes[] = 'pending';
			/* translators: %s: title of menu item in draft status */
			$title = sprintf( __( '%s (Pending)' ), $item->title );
		}

		$title = ( ! isset( $item->label ) || '' == $item->label ) ? $title : $item->label;

		$submenu_text = '';
		if ( 0 == $depth ) {
			$submenu_text = 'style="display: none;"';
		}

		?>
	<li id="menu-item-<?php echo $item_id; ?>" class="<?php echo implode( ' ', $classes ); ?>">
		<div class="menu-item-bar">
			<div class="menu-item-handle">
				<span class="item-title"><span class="menu-item-title"><?php echo esc_html( $title ); ?></span> <span
						class="is-submenu" <?php echo $submenu_text; ?>><?php _e( 'sub item' ); ?></span></span>
				<span class="item-controls">
						<span class="item-type"><?php echo esc_html( $item->type_label ); ?></span>
						<span class="item-order hide-if-js">
							<a href="<?php
							echo wp_nonce_url(
								add_query_arg(
									array(
										'action'    => 'move-up-menu-item',
										'menu-item' => $item_id,
									),
									remove_query_arg( $removed_args, admin_url( 'nav-menus.php' ) )
								),
								'move-menu_item'
							);
							?>" class="item-move-up" aria-label="<?php esc_attr_e( 'Move up' ) ?>">&#8593;</a>
							|
							<a href="<?php
							echo wp_nonce_url(
								add_query_arg(
									array(
										'action'    => 'move-down-menu-item',
										'menu-item' => $item_id,
									),
									remove_query_arg( $removed_args, admin_url( 'nav-menus.php' ) )
								),
								'move-menu_item'
							);
							?>" class="item-move-down" aria-label="<?php esc_attr_e( 'Move down' ) ?>">&#8595;</a>
						</span>
						<a class="item-edit" id="edit-<?php echo $item_id; ?>" href="<?php
						echo ( isset( $_GET['edit-menu-item'] ) && $item_id == $_GET['edit-menu-item'] ) ? admin_url( 'nav-menus.php' ) : add_query_arg( 'edit-menu-item', $item_id, remove_query_arg( $removed_args, admin_url( 'nav-menus.php#menu-item-settings-' . $item_id ) ) );
						?>" aria-label="<?php esc_attr_e( 'Edit menu item' ); ?>"><?php _e( 'Edit' ); ?></a>
					</span>
			</div>
		</div>

		<div class="menu-item-settings wp-clearfix" id="menu-item-settings-<?php echo $item_id; ?>">
			<?php if ( 'custom' == $item->type ) : ?>
				<p class="field-url description description-wide">
					<label for="edit-menu-item-url-<?php echo $item_id; ?>">
						<?php _e( 'URL' ); ?><br/>
						<input type="text" id="edit-menu-item-url-<?php echo $item_id; ?>"
						       class="widefat code edit-menu-item-url" name="menu-item-url[<?php echo $item_id; ?>]"
						       value="<?php echo esc_attr( $item->url ); ?>"/>
					</label>
				</p>
			<?php endif; ?>
			<p class="description description-wide">
				<label for="edit-menu-item-title-<?php echo $item_id; ?>">
					<?php _e( 'Navigation Label' ); ?><br/>
					<input type="text" id="edit-menu-item-title-<?php echo $item_id; ?>"
					       class="widefat edit-menu-item-title" name="menu-item-title[<?php echo $item_id; ?>]"
					       value="<?php echo esc_attr( $item->title ); ?>"/>
				</label>
			</p>
			// <p class="description description-wide">
			// 	<label for="edit-menu-item-visible-only-mobile-<?php echo $item_id; ?>">
			// 		<input type="checkbox" id="edit-menu-item-visible-only-mobile-<?php echo $item_id; ?>"
			// 		       name="menu-item-visible-only-mobile[<?php echo $item_id; ?>]" value="ya-visible-only-mobile" <?php checked( $item->visible_only_mobile, 'ya-visible-only-mobile' ); ?>>
			// 		Только для мобильных устройств?
			// 	</label>
			// </p>
			<p class="field-title-attribute field-attr-title description description-wide">
				<label for="edit-menu-item-attr-title-<?php echo $item_id; ?>">
					<?php _e( 'Title Attribute' ); ?><br/>
					<input type="text" id="edit-menu-item-attr-title-<?php echo $item_id; ?>"
					       class="widefat edit-menu-item-attr-title"
					       name="menu-item-attr-title[<?php echo $item_id; ?>]"
					       value="<?php echo esc_attr( $item->post_excerpt ); ?>"/>
				</label>
			</p>
			<p class="field-link-target description">
				<label for="edit-menu-item-target-<?php echo $item_id; ?>">
					<input type="checkbox" id="edit-menu-item-target-<?php echo $item_id; ?>" value="_blank"
					       name="menu-item-target[<?php echo $item_id; ?>]"<?php checked( $item->target, '_blank' ); ?> />
					<?php _e( 'Open link in a new tab' ); ?>
				</label>
			</p>
			<p class="field-css-classes description description-thin">
				<label for="edit-menu-item-classes-<?php echo $item_id; ?>">
					<?php _e( 'CSS Classes (optional)' ); ?><br/>
					<input type="text" id="edit-menu-item-classes-<?php echo $item_id; ?>"
					       class="widefat code edit-menu-item-classes" name="menu-item-classes[<?php echo $item_id; ?>]"
					       value="<?php echo esc_attr( implode( ' ', $item->classes ) ); ?>"/>
				</label>
			</p>
			<p class="field-xfn description description-thin">
				<label for="edit-menu-item-xfn-<?php echo $item_id; ?>">
					<?php _e( 'Link Relationship (XFN)' ); ?><br/>
					<input type="text" id="edit-menu-item-xfn-<?php echo $item_id; ?>"
					       class="widefat code edit-menu-item-xfn" name="menu-item-xfn[<?php echo $item_id; ?>]"
					       value="<?php echo esc_attr( $item->xfn ); ?>"/>
				</label>
			</p>
			<p class="field-description description description-wide">
				<label for="edit-menu-item-description-<?php echo $item_id; ?>">
					<?php _e( 'Description' ); ?><br/>
					<textarea id="edit-menu-item-description-<?php echo $item_id; ?>"
					          class="widefat edit-menu-item-description" rows="3" cols="20"
					          name="menu-item-description[<?php echo $item_id; ?>]"><?php echo esc_html( $item->description ); // textarea_escaped ?></textarea>
					<span
						class="description"><?php _e( 'The description will be displayed in the menu if the current theme supports it.' ); ?></span>
				</label>
			</p>

			<p class="field-move hide-if-no-js description description-wide">
				<label>
					<span><?php _e( 'Move' ); ?></span>
					<a href="#" class="menus-move menus-move-up" data-dir="up"><?php _e( 'Up one' ); ?></a>
					<a href="#" class="menus-move menus-move-down" data-dir="down"><?php _e( 'Down one' ); ?></a>
					<a href="#" class="menus-move menus-move-left" data-dir="left"></a>
					<a href="#" class="menus-move menus-move-right" data-dir="right"></a>
					<a href="#" class="menus-move menus-move-top" data-dir="top"><?php _e( 'To the top' ); ?></a>
				</label>
			</p>

			<div class="menu-item-actions description-wide submitbox">
				<?php if ( 'custom' != $item->type && $original_title !== false ) : ?>
					<p class="link-to-original">
						<?php printf( __( 'Original: %s' ), '<a href="' . esc_attr( $item->url ) . '">' . esc_html( $original_title ) . '</a>' ); ?>
					</p>
				<?php endif; ?>
				<a class="item-delete submitdelete deletion" id="delete-<?php echo $item_id; ?>" href="<?php
				echo wp_nonce_url(
					add_query_arg(
						array(
							'action'    => 'delete-menu-item',
							'menu-item' => $item_id,
						),
						admin_url( 'nav-menus.php' )
					),
					'delete-menu_item_' . $item_id
				); ?>"><?php _e( 'Remove' ); ?></a> <span class="meta-sep hide-if-no-js"> | </span> <a
					class="item-cancel submitcancel hide-if-no-js" id="cancel-<?php echo $item_id; ?>"
					href="<?php echo esc_url( add_query_arg( array(
						'edit-menu-item' => $item_id,
						'cancel'         => time()
					), admin_url( 'nav-menus.php' ) ) );
					?>#menu-item-settings-<?php echo $item_id; ?>"><?php _e( 'Cancel' ); ?></a>
			</div>

			<input class="menu-item-data-db-id" type="hidden" name="menu-item-db-id[<?php echo $item_id; ?>]"
			       value="<?php echo $item_id; ?>"/>
			<input class="menu-item-data-object-id" type="hidden" name="menu-item-object-id[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->object_id ); ?>"/>
			<input class="menu-item-data-object" type="hidden" name="menu-item-object[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->object ); ?>"/>
			<input class="menu-item-data-parent-id" type="hidden" name="menu-item-parent-id[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->menu_item_parent ); ?>"/>
			<input class="menu-item-data-position" type="hidden" name="menu-item-position[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->menu_order ); ?>"/>
			<input class="menu-item-data-type" type="hidden" name="menu-item-type[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->type ); ?>"/>
		</div><!-- .menu-item-settings-->
		<ul class="menu-item-transport"></ul>
		<?php
		$output .= ob_get_clean();
	}
}

// add_filter( 'wp_edit_nav_menu_walker', function ( $class ) {
// 	return 'Custom_Walker_Nav_Menu_Edit';
// } );


/**
 * Изменение классов меню без создания Walker
 */

/**
 * Menu registration
 */
add_action( 'init', function () {
	register_nav_menu( 'header-menu', __( 'Header Menu', 'terrag' ) );
} );

/**
 * Add menu classes for <li>
 */
add_filter( 'nav_menu_css_class', function ( $classes, $item, $args, $depth ) {
	if ( $args->menu_id == 'nav-mobile' ) {
		if ( $depth === 0 ) {
			$classes[] = 'nav-mobile__item';
		} else if ( $depth === 1 ) {
			$classes[] = 'nav-mobile-dropdown__items';
		}
	} else {
		if ( $depth === 0 ) {
			$classes[] = 'header-nav__item';
		} else if ( $depth === 1 ) {
			$classes[] = 'header-nav-dropdown__items';
		}
	}

	if ( in_array( 'current-menu-item', $classes ) ) {
		$classes[] = 'active';
	}

	return $classes;
}, 10, 4 );

/**
 * Add menu classes for <a>
 */
add_filter( 'nav_menu_link_attributes', function ( $atts, $item, $args, $depth ) {
	if ( $args->menu_id == 'nav-mobile' ) {
		if ( $depth === 0 ) {
			$atts['class'] = 'nav-mobile__link';
		} else if ( $depth === 1 ) {
			$atts['class'] = 'nav-mobile-dropdown__link';
		}
	} else {
		if ( $depth === 0 ) {
			$atts['class'] = 'header-nav__link';
		} else if ( $depth === 1 ) {
			$atts['class'] = 'header-nav-dropdown__link';
		}
	}

	return $atts;
}, 10, 4 );

/**
 * Replace menu classes for nested <ul>
 */
add_filter( 'wp_nav_menu', function ( $menu, $args ) {
	if ( $args->menu_id == 'nav-mobile' ) {
		$menu = preg_replace( '/ class="sub-menu"/', '/ class="nav-mobile-dropdown" /', $menu );
	} else {
		$menu = preg_replace( '/ class="sub-menu"/', '/ class="header-nav-dropdown" /', $menu );
	}

	return $menu;
}, 10, 4 );