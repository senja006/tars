<?php
if ( is_singular() ) {
	$content = apply_filters( 'the_content', get_the_content() );
} else if ( $template_page ) {
	$content = apply_filters( 'the_content', get_post_field( 'post_content', $template_page ) );
} else {
	$content = apply_filters( 'the_content', get_the_content() );
}
?>

<div class="ya-article ya-typography-styles">
	<?php echo $content; ?>
</div>

