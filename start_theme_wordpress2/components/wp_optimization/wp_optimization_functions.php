<?php

/**
 * Cleaners and optimizations features
 * @since  1.0
 */


/**
 * HTML compression
 */
add_action( 'get_header', function () {
	if ( env( 'WP_ENV' ) !== 'production' ) {
		return;
	}

	ob_start( 'wp_html_compression_finish' );

} );

class WP_HTML_Compression {
	protected $compress_css = true;
	protected $compress_js = true;
	protected $info_comment = true;
	protected $remove_comments = true;

	protected $html;

	public function __construct( $html ) {
		if ( ! empty( $html ) ) {
			$this->parseHTML( $html );
		}
	}

	public function __toString() {
		return $this->html;
	}

	protected function bottomComment( $raw, $compressed ) {
		$raw        = strlen( $raw );
		$compressed = strlen( $compressed );
		$savings    = ( $raw - $compressed ) / $raw * 100;
		$savings    = round( $savings, 2 );

		return '<!-- HTML Minify | credit http://fastwp.de/snippets/html-minify/ | Saved ' . $savings . '% | From ' . $raw . ' Bytes, to ' . $compressed . ' Bytes -->';
	}

	protected function minifyHTML( $html ) {
		$pattern = '/<(?<script>script).*?<\/script\s*>|<(?<style>style).*?<\/style\s*>|<!(?<comment>--).*?-->|<(?<tag>[\/\w.:-]*)(?:".*?"|\'.*?\'|[^\'">]+)*>|(?<text>((<[^!\/\w.:-])?[^<]*)+)|/si';
		preg_match_all( $pattern, $html, $matches, PREG_SET_ORDER );
		$overriding = false;
		$raw_tag    = false;
		$html       = '';
		foreach ( $matches as $token ) {
			$tag     = ( isset( $token['tag'] ) ) ? strtolower( $token['tag'] ) : null;
			$content = $token[0];
			if ( is_null( $tag ) ) {
				if ( ! empty( $token['script'] ) ) {
					$strip = $this->compress_js;
				} else if ( ! empty( $token['style'] ) ) {
					$strip = $this->compress_css;
				} else if ( $content == '<!--wp-html-compression no compression-->' ) {
					$overriding = ! $overriding;
					continue;
				} else if ( $this->remove_comments ) {
					if ( ! $overriding && $raw_tag != 'textarea' ) {
						$content = preg_replace( '/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s', '', $content );
					}
				}
			} else {
				if ( $tag == 'pre' || $tag == 'textarea' ) {
					$raw_tag = $tag;
				} else if ( $tag == '/pre' || $tag == '/textarea' ) {
					$raw_tag = false;
				} else {
					if ( $raw_tag || $overriding ) {
						$strip = false;
					} else {
						$strip   = true;
						$content = preg_replace( '/(\s+)(\w++(?<!\baction|\balt|\bcontent|\bsrc)="")/', '$1', $content );
						$content = str_replace( ' />', '/>', $content );
					}
				}
			}
			if ( $strip ) {
				$content = $this->removeWhiteSpace( $content );
			}
			$html .= $content;
		}

		return $html;
	}

	public function parseHTML( $html ) {
		$this->html = $this->minifyHTML( $html );
		if ( $this->info_comment ) {
			$this->html .= "\n" . $this->bottomComment( $html, $this->html );
		}
	}

	protected function removeWhiteSpace( $str ) {
		$str = str_replace( "\t", ' ', $str );
		$str = str_replace( "\n", '', $str );
		$str = str_replace( "\r", '', $str );
		while ( stristr( $str, '  ' ) ) {
			$str = str_replace( '  ', ' ', $str );
		}

		return $str;
	}
}

function wp_html_compression_finish( $html ) {
	return new WP_HTML_Compression( $html );
}

/**
 * Delayed execution of scripts
 */
add_filter( 'clean_url', function ( $url ) {
	if ( false === strpos( $url, '.js' ) ) {
		return $url;
	}

	return ! is_admin() ? "$url' defer='defer" : $url;
}, 11, 1 );

/**
 * Removing defaults scripts
 */
add_action( 'wp_head', function () {
	wp_deregister_script( 'sitepress' );
} );

add_action( 'wp_footer', function () {
	wp_deregister_script( 'wp-embed' );
} );

// add_action( 'widgets_init', function () {
// 	global $wp_widget_factory;
// 	remove_action(
// 		'wp_head',
// 		array( $wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style' )
// 	);
// } );

/**
 * Unregistering default wp widgets
 */
function unregister_default_wp_widgets() {
	unregister_widget( 'WP_Widget_Pages' );
	unregister_widget( 'WP_Widget_Calendar' );
	unregister_widget( 'WP_Widget_Archives' );
	unregister_widget( 'WP_Widget_Links' );
	unregister_widget( 'WP_Widget_Meta' );
	unregister_widget( 'WP_Widget_Search' );
	unregister_widget( 'WP_Widget_Text' );
	unregister_widget( 'WP_Widget_Categories' );
	unregister_widget( 'WP_Widget_Recent_Posts' );
	unregister_widget( 'WP_Widget_Recent_Comments' );
	unregister_widget( 'WP_Widget_RSS' );
	unregister_widget( 'WP_Widget_Tag_Cloud' );
	unregister_widget( 'WP_Nav_Menu_Widget' );
}

add_action( 'widgets_init', 'unregister_default_wp_widgets', 1 );

if ( is_admin() ) {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_head', 'icl_lang_sel_nav_css', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	define( 'ICL_DONT_LOAD_LANGUAGE_SELECTOR_CSS', true );
	define( 'ICL_DONT_LOAD_NAVIGATION_CSS', true );
}

/**
 * Disable WP Features
 */
add_action( 'init', function () {

	if ( is_admin() ) {
		return;
	}

	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );

	remove_action( 'wp_head', 'wp_generator' );
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
	remove_action( 'wp_head', 'index_rel_link' );
	remove_action( 'wp_head', 'wp_shortlink_wp_head' );
	remove_action( 'wp_head', 'feed_links_extra', 3 );
	remove_action( 'wp_head', 'feed_links', 2 );
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10 );
	remove_action( 'set_comment_cookies', 'wp_set_comment_cookies' );

} );


/**
 * Security features
 *
 */
if ( ! is_admin() ) {
	add_filter( 'xmlrpc_enabled', '__return_false' );
	add_filter( 'json_enabled', '__return_false' );
	add_filter( 'json_jsonp_enabled', '__return_false' );
	add_filter( 'rest_enabled', '__return_false' );
	add_filter( 'rest_jsonp_enabled', '__return_false' );
	add_filter( 'rest_authentication_errors', 'throw_rest_auth_error' );
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'xmlrpc_rsd_apis', 'rest_output_rsd' );
	remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );
	remove_action( 'template_redirect', 'rest_output_link_header', 11 );
}

if ( defined( 'XMLRPC_REQUEST' ) && XMLRPC_REQUEST ) {
	wp_die();
}
if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
	wp_die();
}
function throw_rest_auth_error( $access ) {
	return new WP_Error( 'api_disabled', 'The REST API is disabled.', [ 'status' => 404 ] );
}

/**
 * Disable reset password
 */
class Password_Reset_Removed {

	function __construct() {
		add_filter( 'show_password_fields', array( $this, 'disable' ) );
		add_filter( 'allow_password_reset', array( $this, 'disable' ) );
		add_filter( 'gettext', array( $this, 'remove' ) );
	}

	function disable() {
		if ( is_admin() ) {
			$userdata = wp_get_current_user();
			$user     = new WP_User( $userdata->ID );
			if ( ! empty( $user->roles ) && is_array( $user->roles ) && $user->roles[0] == 'administrator' ) {
				return true;
			}
		}

		return false;
	}

	function remove( $text ) {
		return str_replace( array(
			'Lost your password?',
			'Lost your password',
			'Mot de passe oublié',
			'Mot de passe oublié?',
			'שחזור סיסמה?',
			'שחזור סיסמה'
		), '', trim( $text, '?' ) );
	}
}

$pass_reset_removed = new Password_Reset_Removed();


/**
 * Remove query string from static files
 *
 * @param $src
 *
 * @return string
 */
function remove_cssjs_ver( $src ) {
	if ( strpos( $src, '?ver=' ) ) {
		$src = remove_query_arg( 'ver', $src );
	}

	return $src;
}

add_filter( 'style_loader_src', 'remove_cssjs_ver', 10, 2 );
add_filter( 'script_loader_src', 'remove_cssjs_ver', 10, 2 );