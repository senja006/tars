<?php

/**
 * Adding customizer settings
 */
add_action( 'customize_register', function ($wp_customize) {
	$wp_customize->add_section( 'email', array(
		'title' => 'Почта'
	) );

	$wp_customize->add_setting( 'email_to', array(
		'default'   => '',
		'transport' => 'refresh',
	) );

	$wp_customize->add_setting( 'email_from', array(
		'default'   => '',
		'transport' => 'refresh',
	) );

	$wp_customize->add_setting( 'email_name_from', array(
		'default'   => '',
		'transport' => 'refresh',
	) );

	$wp_customize->add_control(
		new WP_Customize_Control(
			$wp_customize,
			'email_to',
			array(
				'label'       => 'Email (куда)',
				'section'     => 'email',
				'settings'    => 'email_to',
				'description' => 'Сюда будут отправлены все уведомления из форм'
			)
		)
	);

	$wp_customize->add_control(
		new WP_Customize_Control(
			$wp_customize,
			'email_from',
			array(
				'label'       => 'Email (от кого)',
				'section'     => 'email',
				'settings'    => 'email_from',
				'description' => 'Будет указан как email отправителя'
			)
		)
	);

	$wp_customize->add_control(
		new WP_Customize_Control(
			$wp_customize,
			'email_name_from',
			array(
				'label'       => 'От кого',
				'section'     => 'email',
				'settings'    => 'email_name_from',
				'description' => 'Будет указан как отправитель'
			)
		)
	);
} );


/**
 * Settings send email
 */

function wp_mail_change_from_name( $email_from ) {
	$from_name = get_theme_mod( 'email_name_from' );

	return $from_name;
}

function wp_mail_change_from( $email_address ) {
	$from = get_theme_mod( 'email_from' );

	return $from;
}

add_filter( 'wp_mail_from_name', 'wp_mail_change_from_name' );
add_filter( 'wp_mail_from', 'wp_mail_change_from' );
add_filter( 'wp_mail_content_type', create_function( '', 'return "text/html";' ) );