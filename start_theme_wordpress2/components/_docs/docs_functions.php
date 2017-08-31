<?php

/**
 * Новый компонент acf flexible
 */

$components_acf[] = array(
	'key'        => '57e3ab24877bb',
	'name'       => 'docs',
	'label'      => 'Документ',
	'display'    => 'row',
	'sub_fields' => array(
		array(
			'key'               => 'field_57e3ae306be64',
			'label'             => 'Текст ссылки на документ',
			'name'              => 'name',
			'type'              => 'text',
			'instructions'      => '',
			'required'          => 0,
			'conditional_logic' => 0,
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
		),
		array(
			'key'               => 'field_57e3ab29aa1fa',
			'label'             => $labels['visible_only_mobile'],
			'name'              => 'visible_only_mobile',
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
	),
);
