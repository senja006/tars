<?php

$logo_href = 'href="' . get_home_url() . '"';

if ( is_front_page() ) {
	$logo_href = '';
}

?>

<?php if ( $instance['img'] ) : ?>
	<div class="ya-logo">
		<a <?php echo $logo_href ?> class="ya-logo__a">
			<img src="<?php echo $instance['img']; ?>" alt="Логотип"
			     width="<?php echo $instance['width']; ?>"/>
		</a>
	</div>
<?php endif; ?>



