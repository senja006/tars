<?php

/**
 * Новый компонент acf flexible
 */

$components_acf[] = array(
	'key'        => '57d4ed64a1511',
	'name'       => 'intro',
	'label'      => 'Интро',
	'display'    => 'block',
	'sub_fields' => array()
);


/**
 * Новая группа или поле acf
 */
$acf_template_group        = array();
$acf_template              = array();
$acf_template_for_flexible = array(
	'key'        => '57d4ed64a1511',
	'name'       => 'intro',
	'label'      => 'Интро',
	'display'    => 'block',
	'sub_fields' => array()
);
function register_acf_components_template() {
	global $acf_template_group;
	global $acf_template;

	if ( function_exists( 'acf_add_local_field_group' ) ) {
		acf_add_local_field_group( $acf_template_group );
	}

	// добавление в группу
	if ( function_exists( 'acf_add_local_field' ) ) {
		$acf_template['parent'] = $acf_template_group['key'];
		acf_add_local_field( $acf_template );
	}

	// добавление в flexible
	if ( function_exists( 'acf_add_local_field' ) ) {
		$acf_template['layouts'] = $acf_template_group['key'];
		acf_add_local_field( $acf_template );
	}
}

add_action( 'register_acf_components', 'register_acf_components_template', 10, 1 );

