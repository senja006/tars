<?php

/**
 * List of social networks
 */
$GLOBALS['social_networks'] = [
	'facebook'  => [
		'icon_light' => 'icon-facebook-square.svg'
	],
	'instagram' => [
		'icon_light' => 'icon-instagram.svg'
	],
	'google'    => [
		'icon_light' => 'icon-google.svg'
	],
	'pinterest' => [
		'icon_light' => 'icon-pinterest-square.svg'
	]
];

/**
 * Creating options in customizer
 */
add_action( 'customize_register', function ( $wp_customize ) {
	$wp_customize->add_panel( 'social_networks', array(
		'title' => __( 'Social networks', 'byt' )
	) );

	/**
	 * Adding options for setting links
	 */
	$wp_customize->add_section( 'social_networks_links', array(
		'title' => __( 'Social networks links', 'byt' ),
		'panel' => 'social_networks'
	) );

	foreach ( $GLOBALS['social_networks'] as $name => $options ) {
		$wp_customize->add_setting( 'social_network_' . $name, array(
			'default'   => '',
			'transport' => 'postMessage', // postMessage
		) );

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'social_network_' . $name,
				array(
					'label'    => __( ucfirst( $name ), 'byt' ),
					'section'  => 'social_networks_links',
					'settings' => 'social_network_' . $name,
				)
			)
		);
	}

	/**
	 * Choice social in header
	 */
	$wp_customize->add_section( 'social_networks_header', array(
		'title' => __( 'Social networks in header', 'byt' ),
		'panel' => 'social_networks'
	) );

	foreach ( $GLOBALS['social_networks'] as $name => $options ) {
		$wp_customize->add_setting( 'social_network_header_' . $name, array(
			'default'   => '',
			'transport' => 'refresh', // postMessage
		) );

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'social_network_header_' . $name,
				array(
					'label'    => __( ucfirst( $name ), 'byt' ),
					'section'  => 'social_networks_header',
					'settings' => 'social_network_header_' . $name,
					'type'     => 'checkbox'
				)
			)
		);

		$wp_customize->selective_refresh->add_partial( 'social_network_header_' . $name, array(
			'selector'        => '.topline__left-social',
			'settings'        => 'social_network_header_' . $name,
			'render_callback' => function () {
				return '';
			}
		) );
	}
} );

/**
 * Getting social networks data
 */
function get_social_networks_data( $location, $type_icon ) {
	$data = [];
	foreach ( $GLOBALS['social_networks'] as $name => $options ) {
		$link = get_theme_mod( 'social_network_' . $location . '_' . $name );
		if ( $link ) {
			$data[ $name ] = [
				'icon' => $options[ $type_icon ],
				'link' => $link
			];
		}
	}

	return $data;
}
