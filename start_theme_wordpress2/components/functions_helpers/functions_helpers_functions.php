<?php

/**
 * Getting attachment ID by url
 *
 * First checks to see if the $url is pointing to a file that exists in
 * the wp-content directory. If so, then we search the database for a
 * partial match consisting of the remaining path AFTER the wp-content
 * directory. Finally, if a match is found the attachment ID will be
 * returned.
 *
 * @param string $url The URL of the image (ex: http://mysite.com/wp-content/uploads/2013/05/test-image.jpg)
 *
 * @return int|null $attachment Returns an attachment ID, or null if no attachment is found
 */
function fjarrett_get_attachment_id_by_url( $url ) {
	// Split the $url into two parts with the wp-content directory as the separator
	$parsed_url = explode( parse_url( WP_CONTENT_URL, PHP_URL_PATH ), $url );
	// Get the host of the current site and the host of the $url, ignoring www
	$this_host = str_ireplace( 'www.', '', parse_url( home_url(), PHP_URL_HOST ) );
	$file_host = str_ireplace( 'www.', '', parse_url( $url, PHP_URL_HOST ) );
	// Return nothing if there aren't any $url parts or if the current host and $url host do not match
	if ( ! isset( $parsed_url[1] ) || empty( $parsed_url[1] ) || ( $this_host != $file_host ) ) {
		return;
	}
	// Now we're going to quickly search the DB for any attachment GUID with a partial path match
	// Example: /uploads/2013/05/test-image.jpg
	global $wpdb;
	$attachment = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM {$wpdb->prefix}posts WHERE guid RLIKE %s;", $parsed_url[1] ) );

	// Returns null if no attachment is found
	return $attachment[0];
}

/**
 * Clear phone number
 */
 function get_clear_phone( $str_phone ) {
	$int_phone  = (int) preg_replace( '/[^0-9.]+/', '', $str_phone );
	$first_char = substr( (string) $int_phone, 0, 1 );
	$str_phone  = substr( $str_phone, strpos( $str_phone, $first_char ) );
	$str_phone  = preg_replace( '/[^0-9.]+/', '', $str_phone );
 
 	return $str_phone;
 }

/**
 * Getting name like Lastname F.P.
 */
function get_short_name( $name ) {
	$name_arr   = explode( ' ', $name );
	$surname    = $name_arr[0];
	$name       = mb_substr( $name_arr[1], 0, 1, "UTF-8" );
	$patronymic = mb_substr( $name_arr[2], 0, 1, "UTF-8" );

	return $surname . ' ' . $name . '.' . $patronymic . '.';
}

/**
 * Getting file name by url
 */
function get_file_name_by_url( $url ) {
	$arr = explode( '/', $url );

	return $arr[ count( $arr ) - 1 ];
}

/**
 * Getting file size
 */
function get_file_size( $id ) {
	$filesize = filesize( get_attached_file( $id ) );

	return size_format( $filesize, 2 );
}

/**
 * Getting attribute of shortcode from text
 *
 * @uses get_shortcode_regex()
 * @uses shortcode_parse_atts()
 *
 * @param  string $tag Shortcode tag
 * @param  string $text Text containing shortcodes
 *
 * @return array  $out   Array of attributes
 */

function get_all_shortcode_attributes( $tag, $text ) {
	preg_match_all( '/' . get_shortcode_regex() . '/s', $text, $matches );
	$out = array();
	if ( isset( $matches[2] ) ) {
		foreach ( (array) $matches[2] as $key => $value ) {
			if ( $tag === $value ) {
				$out[] = shortcode_parse_atts( $matches[3][ $key ] );
			}
		}
	}

	return $out;
}