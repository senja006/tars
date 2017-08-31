<?php

$acf_constructor = array(
	'key'                   => 'group_57d4e767d387d',
	'title'                 => 'Конструктор',
	'fields'                => array(),
	'location'              => array(
		array(
			array(
				'param'    => 'post_type',
				'operator' => '==',
				'value'    => 'page',
			),
		),
	),
	'menu_order'            => 0,
	'position'              => 'normal',
	'style'                 => 'seamless',
	'label_placement'       => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen'        => '',
);
$acf_components  = array(
	'key'               => 'field_57d4ed17e7677',
	'label'             => 'Компоненты',
	'name'              => 'components',
	'type'              => 'flexible_content',
	'instructions'      => '',
	'required'          => 0,
	'conditional_logic' => 0,
	'wrapper'           => array(
		'width' => '',
		'class' => '',
		'id'    => '',
	),
	'button_label'      => 'Добавить компонент',
	'min'               => '',
	'max'               => '',
	'layouts'           => array(),
);
function register_acf_components( $components ) {
	global $acf_constructor;
	global $acf_components;
	global $acf_columns;

	$acf_columns['sub_fields'][0]['layouts'][0]['sub_fields'][0]['layouts'] = $components;
	$acf_columns['sub_fields'][1]['layouts'] = $components;
	$acf_columns['sub_fields'][2]['layouts'][0]['sub_fields'][0]['layouts'] = $components;

	if ( function_exists( 'acf_add_local_field_group' ) ) {
		acf_add_local_field_group( $acf_constructor );
	}

	if ( function_exists( 'acf_add_local_field' ) ) {
		$acf_components['layouts'] = $components;
		$acf_components['layouts'][] = $acf_columns;
		$acf_components['parent'] = $acf_constructor['key'];
		acf_add_local_field( $acf_components );
	}
}

add_action( 'register_acf_components', 'register_acf_components', 10, 1 );


/**
 * Получение массива компонентов
 */

function get_my_components( $arr ) {
	$components = array();
	foreach ( $arr as $component ) {
		$name                = $component['acf_fc_layout'];
		$components[ $name ] = $component;
	}

	return $components;
}