<?php


/**
 * Компонент acf
 */
$acf_columns = array(
	'key'        => '57d5669fc1415',
	'name'       => 'columns',
	'label'      => 'Колонки',
	'display'    => 'block',
	'sub_fields' => array(
		array(
			'key'               => 'field_57d566a69828f',
			'label'             => 'Левая колонка',
			'name'              => 'columns_left',
			'type'              => 'flexible_content',
			'instructions'      => '',
			'required'          => 0,
			'conditional_logic' => 0,
			'wrapper'           => array(
				'width' => '',
				'class' => '',
				'id'    => '',
			),
			'button_label'      => 'Добавить контейнер в левую колонку',
			'min'               => '',
			'max'               => '',
			'layouts'           => array(
				array(
					'key'        => '57d578fd85835',
					'name'       => 'sidebar_block',
					'label'      => 'Контейнер',
					'display'    => 'row',
					'sub_fields' => array(
						array(
							'key'               => 'field_57e2e42a59fb1',
							'label'             => 'Компоненты',
							'name'              => 'sidebar_components',
							'type'              => 'flexible_content',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'button_label'      => 'Добавить компонент в левую колонку',
							'min'               => '',
							'max'               => '',
							'layouts'           => array(),
						),
					),
					'min'        => '',
					'max'        => '',
				),
			),
		),
		array(
			'key'               => 'field_57d566a69828a',
			'label'             => 'Основное содержание',
			'name'              => 'columns_middle',
			'type'              => 'flexible_content',
			'instructions'      => '',
			'required'          => 0,
			'conditional_logic' => 0,
			'wrapper'           => array(
				'width' => '',
				'class' => '',
				'id'    => '',
			),
			'button_label'      => 'Добавить в основное содержание',
			'min'               => '',
			'max'               => '',
			'layouts'           => array()
		),
		array(
			'key'               => 'field_57d5793798290',
			'label'             => 'Правая колонка',
			'name'              => 'columns_right',
			'type'              => 'flexible_content',
			'instructions'      => '',
			'required'          => 0,
			'conditional_logic' => 0,
			'wrapper'           => array(
				'width' => '',
				'class' => '',
				'id'    => '',
			),
			'button_label'      => 'Добавить контейнер в правую колонку',
			'min'               => '',
			'max'               => '',
			'layouts'           => array(
				array(
					'key'        => '57d57946eecfa',
					'name'       => 'sidebar_block',
					'label'      => 'Контейнер',
					'display'    => 'row',
					'sub_fields' => array(
						array(
							'key'               => 'field_57e35776e81ad',
							'label'             => 'Компоненты',
							'name'              => 'sidebar_components',
							'type'              => 'flexible_content',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'button_label'      => 'Добавить компонент в правую колонку',
							'min'               => '',
							'max'               => '',
							'layouts'           => array(),
						),
					),
					'min'        => '',
					'max'        => '',
				),
			),
		),
	)
);


/**
 * Настройки sidebar_block
 */
$acf_columns_sidebar_options = array(
	array(
		'key'               => 'field_57d6a60cac3f1',
		'label'             => 'Выровнять по вертикальному центру',
		'name'              => 'flex_all_center',
		'type'              => 'true_false',
		'instructions'      => '',
		'required'          => 0,
		'conditional_logic' => 0,
		'wrapper'           => array(
			'width' => '',
			'class' => '',
			'id'    => '',
		),
		'message'           => '',
		'default_value'     => 0,
	),
	array(
		'key'               => 'field_57e2dfe094ebe',
		'label'             => 'Показать только на больших экранах',
		'name'              => 'ya_visible_large',
		'type'              => 'true_false',
		'instructions'      => '',
		'required'          => 0,
		'conditional_logic' => 0,
		'wrapper'           => array(
			'width' => '',
			'class' => '',
			'id'    => '',
		),
		'message'           => '',
		'default_value'     => 0,
	)
);

foreach ( $acf_columns_sidebar_options as $options ) {
	$acf_columns['sub_fields'][0]['layouts'][0]['sub_fields'][] = $options;
	$acf_columns['sub_fields'][2]['layouts'][0]['sub_fields'][] = $options;
}


/**
 * Формирование набора классов для sidebar_block на основе настроек
 */

function get_sidebar_classes() {
	$sidebar_classes = '';
	$sidebar_classes .= get_sub_field( 'flex_all_center' ) ? ' ya-flex-all-center' : '';
	$sidebar_classes .= get_sub_field( 'ya_visible_large' ) ? ' ya-visible-large' : '';

	return $sidebar_classes;
}