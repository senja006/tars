<?php

/**
 * Новый компонент acf flexible
 */

$components_acf[] = array(
	'key'        => '57d68e2f9ec1e',
	'name'       => 'page_title',
	'label'      => 'Заголовок страницы',
	'display'    => 'row',
	'sub_fields' => array(
		array(
			'key'               => 'field_57d692b2e4983',
			'label'             => 'Выровнять по центру',
			'name'              => 'text_center',
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
			'key'               => 'field_57d68e5d77704',
			'label'             => 'Использовать основной заголовок',
			'name'              => 'is_main_title',
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
			'default_value'     => 1,
		),
		array(
			'key'               => 'field_57d68e3777703',
			'label'             => 'Заголовок',
			'name'              => 'title',
			'type'              => 'text',
			'instructions'      => '',
			'required'          => 0,
			'conditional_logic' => array(
				array(
					array(
						'field'    => 'field_57d68e5d77704',
						'operator' => '!=',
						'value'    => '1',
					),
				),
			),
			'wrapper'           => array(
				'width' => '',
				'class' => '',
				'id'    => '',
			),
			'default_value'     => '',
			'placeholder'       => '',
			'prepend'           => '',
			'append'            => '',
			'maxlength'         => '',
			'readonly'          => 0,
			'disabled'          => 0,
		)
	)
);
