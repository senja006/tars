<?php

/**
 * Если необходимо шарить какую-то информацию в соц сети, то перед подключением
 * этого компонента необходимо объявить массив
 * $sharer = array(
 *      'title'    => '',
 *      'hashtags' => '',
 *      'url'      => $url ? home_url() . $_SERVER['REQUEST_URI'] : null,
 * );
 * Для шаринга также используется плагин https://github.com/ellisonleao/sharer.js
 */

$social         = new WP_Query( array(
	'post_type'      => 'social',
	'posts_per_page' => - 1
) );
$create_sharing = $sharer && $sharer['source'] != 'none' ? true : false;
?>

<?php if ( $social->have_posts() ) : ?>
	<div class="ya-social">
		<div class="ya-social__list">
			<ul class="ya-social__list-ul">
				<?php while ( $social->have_posts() ) : $social->the_post(); ?>
					<li class="ya-social__list-li">
						<a <?php echo $create_sharing ? '' : 'href="' . get_field( 'url' ) . '"'; ?>
							class="ya-social__list-a <?php echo $create_sharing ? 'sharer' : ''; ?>"
							style="background-color: <?php the_field( 'bg_color' ) ?>" <?php echo $create_sharing ? 'data-sharer="' . get_field( 'source' ) . '" data-title="' . $sharer['title'] . '" data-hashtags="' . $sharer['hashtags'] . '" data-url="' . $sharer['url'] . '"' : ''; ?>><?php the_field( 'button_text' ); ?></a>
					</li>
				<?php endwhile; ?>
			</ul>
		</div>
	</div>
<?php endif; ?>

<?php
$sharer = null;
wp_reset_postdata();
?>
