<?php

/**
 * Новый компонент acf flexible
 */

$components_acf[] = array(
	'key'        => '57d696403099d',
	'name'       => 'content',
	'label'      => 'Контент',
	'display'    => 'block',
	'sub_fields' => array()
);


/**
 * Настройка изображений
 */

function set_image_size_content() {
	add_image_size( 'content_img', 1040, 9999 );
}

add_action( 'after_setup_theme', 'set_image_size_content' );
//echo wp_get_attachment_image_src( get_field( 'course_info_bg_img' ), 'course_info_bg' )[0];


/**
 * Добавление опции к выбору размера изображения при добавлении в запись
 */
function set_names_choose_content( $sizes ) {
	return array_merge( $sizes, array(
		'content_img' => 'Для статьи',
	) );
}

add_filter( 'image_size_names_choose', 'set_names_choose_content' );