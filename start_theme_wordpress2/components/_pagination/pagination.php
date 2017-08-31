<?php if ( get_the_posts_pagination() ) : ?>
	<div class="ya-pagination">
		<div class="ya-pagination__list">
			<?php the_posts_pagination( array(
				'prev_next' => false
			) ); ?>
		</div>
	</div>
<?php endif; ?>