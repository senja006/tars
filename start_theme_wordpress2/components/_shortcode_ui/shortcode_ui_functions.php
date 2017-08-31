<?php

/**
 * Проверка установки плагина Shortcake
 */

function shortcode_ui_detection() {
	if ( ! function_exists( 'shortcode_ui_register_for_shortcode' ) ) {
		add_action( 'admin_notices', 'shortcode_ui_not_exists_notices' );
	}
}

function shortcode_ui_not_exists_notices() {
	if ( current_user_can( 'activate_plugins' ) ) {
		?>
		<div class="error message">
			<p><?php esc_html_e( 'Необходимо установить плагин Shortcode UI.', 'shortcode-ui-example' ); ?></p>
		</div>
		<?php
	}
}

add_action( 'init', 'shortcode_ui_detection' );
