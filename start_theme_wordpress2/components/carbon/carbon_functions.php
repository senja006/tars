<?php

use Carbon_Fields\Container;
use Carbon_Fields\Field;

if ( isset( $carbon_components ) ) {
	$carbon_components
		->add_fields( 'lib_load', array(
			Field::make( 'relationship', 'lib_select', __( 'Load from library', 'krn' ) )
			     ->set_post_type( 'lib_type' )
			     ->set_max( 1 )
		) );

	Container::make( 'post_meta', __( 'Content blocks', 'krn' ) )
	         ->show_on_post_type( array( 'page', 'lib_type' ) )
	         ->add_fields( array( $carbon_components ) );
}

/**
 * Adding a component library
 */
add_action( 'init', function () {
	$labels = array(
		'name'                  => _x( 'Libraries', 'Post Type General Name', 'example' ),
		'singular_name'         => _x( 'Library', 'Post Type Singular Name', 'example' ),
		'menu_name'             => __( 'Libraries', 'example' ),
		'name_admin_bar'        => __( 'Library', 'example' ),
		'archives'              => __( 'Item Archives', 'example' ),
		'attributes'            => __( 'Item Attributes', 'example' ),
		'parent_item_colon'     => __( 'Parent Item:', 'example' ),
		'all_items'             => __( 'All Items', 'example' ),
		'add_new_item'          => __( 'Add New Item', 'example' ),
		'add_new'               => __( 'Add New', 'example' ),
		'new_item'              => __( 'New Item', 'example' ),
		'edit_item'             => __( 'Edit Item', 'example' ),
		'update_item'           => __( 'Update Item', 'example' ),
		'view_item'             => __( 'View Item', 'example' ),
		'view_items'            => __( 'View Items', 'example' ),
		'search_items'          => __( 'Search Item', 'example' ),
		'not_found'             => __( 'Not found', 'example' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'example' ),
		'featured_image'        => __( 'Featured Image', 'example' ),
		'set_featured_image'    => __( 'Set featured image', 'example' ),
		'remove_featured_image' => __( 'Remove featured image', 'example' ),
		'use_featured_image'    => __( 'Use as featured image', 'example' ),
		'insert_into_item'      => __( 'Insert into item', 'example' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'example' ),
		'items_list'            => __( 'Items list', 'example' ),
		'items_list_navigation' => __( 'Items list navigation', 'example' ),
		'filter_items_list'     => __( 'Filter items list', 'example' ),
	);
	$args   = array(
		'label'               => __( 'Library', 'example' ),
		'labels'              => $labels,
		'supports'            => array( 'title', ),
		'hierarchical'        => false,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_position'       => 25,
		'show_in_admin_bar'   => false,
		'show_in_nav_menus'   => false,
		'can_export'          => true,
		'has_archive'         => false,
		'exclude_from_search' => true,
		'publicly_queryable'  => true,
		'rewrite'             => false,
		'capability_type'     => 'page',
		'menu_icon'           => 'dashicons-book'
	);
	register_post_type( 'lib_type', $args );
}, 0 );

/**
 * Getting component data
 */
function carbon_get_component_data( $component ) {
	if ( $component['_type'] == '_lib_load' ) {
		$lib_id    = $component['lib_select'][0];
		$component = carbon_get_post_meta( $lib_id, 'components', 'complex' )[0];
	}

	$name_component = $component['_type'];
	$name_component = substr( $name_component, 1 );

	return [ $component, $name_component ];
}

/**
 * Checking active of carbon
 */
function carbon_fields_is_active() {
	return function_exists( 'carbon_get_post_meta' );
}

/**
 * Remove post editor from pages
 */
add_action( 'admin_init', function () {
	remove_post_type_support( 'page', 'editor' );
} );