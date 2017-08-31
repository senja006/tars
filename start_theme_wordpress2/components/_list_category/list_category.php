<?php

$options_post = explode( '/', $instance['select_post_type'] );

/**
 * Получение списка категорий
 */
$categories = get_categories( array(
	'type'     => $options_post[0],
	'taxonomy' => $options_post[1]
) );

/**
 * Определение текущей категории
 */
$current_category_id = null;
if ( get_query_var( 'cat' ) ) {
	$current_category_id = get_query_var( 'cat' );
} elseif ( get_query_var( 'taxonomy' ) ) {
	$current_category    = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) );
	$current_category    = get_object_vars( $current_category );
	$current_category_id = $current_category['term_id'];
} elseif ( is_singular() ) {
	$current_categories = get_the_category();
	// global $post;
	// $current_categories = get_the_terms( $post->ID, 'category_services' );
	if ( $current_categories ) {
		$current_category_id = get_object_vars( $current_categories[0] )['term_id'];
	}
}

?>

<div class="ya-list-category">
	<div class="ya-list-category__list">
		<ul class="ya-list-category__list-ul">
			<li class="ya-list-category__list-li <?php echo $current_category_id ? '' : 'ya-active'; ?>">
				<a <?php if ( $current_category_id ) : ?> href="<?php echo get_post_type_archive_link( $options_post[0] ); ?>" <?php endif; ?>
					class="ya-list-category__list-a">
					<div class="ya-list-category__list-row">
						<div class="ya-list-category__list-text">Все</div>
						<?php
						$posts_counter = 0;
						foreach ( $categories as $category ) {
							$category_arr = get_object_vars( $category );
							$posts_counter += $category_arr['count'];
						}
						?>
						<div class="ya-list-category__list-num">(<?php echo $posts_counter; ?>)</div>
					</div>
				</a>
			</li>
			<?php foreach ( $categories as $category ) : ?>
				<?php $category_arr = get_object_vars( $category ); ?>
				<?php $is_current_category = $current_category_id == $category_arr['cat_ID']; ?>
				<li class="ya-list-category__list-li <?php echo $is_current_category ? 'ya-active' : ''; ?>">
					<a <?php if ( ! $is_current_category ) : ?> href="<?php echo get_category_link( $category_arr['cat_ID'] ); ?>" <?php endif; ?>
						class="ya-list-category__list-a">
						<div class="ya-list-category__list-row">
							<div class="ya-list-category__list-text"><?php echo $category_arr['name']; ?></div>
							<div class="ya-list-category__list-num">(<?php echo $category_arr['count']; ?>)</div>
						</div>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</div>