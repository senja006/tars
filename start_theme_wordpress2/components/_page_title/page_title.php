<?php

$title = '';

if ( get_sub_field( 'is_main_title' ) ) {
	if ( is_singular() ) {
		$title = get_the_title();
	} else {
		$title = $template_page ? get_the_title( $template_page ) : get_the_title();
	}
} else {
	$title = get_sub_field( 'title' );
}

$text_align_center = get_sub_field( 'text_center' ) ? 'ya-text-center' : '';
?>
<span class="ya-page__title ya-typography-styles <?php echo $text_align_center; ?>"><?php echo $title; ?></span>