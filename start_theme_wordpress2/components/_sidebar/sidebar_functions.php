<?php

/**
 * Регистрация места размещения виджетов
 */

function register_my_sidebars() {
	register_sidebar( array(
		'name'                 => 'Правая колонка в блоге',
		'id'                   => 'list_articles_right',
		'description'          => '',
		'class'                => '',
		'before_widget'        => '<div class="ya-sidebar__block">',
		'before_widget_border' => '<div class="ya-sidebar__block ya-border">',
		'after_widget'         => '</div>',
		'before_title'         => '<span class="ya-sidebar__title">',
		'after_title'          => '</span>',
		'before_subtitle'      => '<span class="ya-sidebar__sub-title">',
		'after_subtitle'       => '</span>'
	) );

	register_sidebar( array(
		'name'                 => 'Левая колонка в списке курсов',
		'id'                   => 'list_courses_left',
		'description'          => '',
		'class'                => '',
		'before_widget'        => '<div class="ya-sidebar__block">',
		'before_widget_border' => '<div class="ya-sidebar__block ya-border">',
		'after_widget'         => '</div>',
		'before_title'         => '<span class="ya-sidebar__title">',
		'after_title'          => '</span>',
		'before_subtitle'      => '<span class="ya-sidebar__sub-title">',
		'after_subtitle'       => '</span>'
	) );
}

add_action( 'widgets_init', 'register_my_sidebars' );