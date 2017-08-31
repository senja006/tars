<div class="ya-columns">
	<div class="ya-content__row">
		<?php if ( have_rows( 'columns_left' ) ) : ?>
			<div class="ya-sidebar">
				<?php
				while ( have_rows( 'columns_left' ) ) {
					the_row();
					$sidebar_classes = get_sidebar_classes();
					while ( have_rows( 'sidebar_components' ) ) {
						the_row();
						require TEMPLATEPATH . '/components/columns/columns_sidebar_before.php';
						$component_name = get_row_layout();
						require TEMPLATEPATH . '/components/' . $component_name . '/' . $component_name . '.php';
						require TEMPLATEPATH . '/components/columns/columns_sidebar_after.php';
					}
				}
				?>
			</div>
		<?php endif; ?>
		<div class="ya-content__main">
			<?php
			if ( have_rows( 'columns_middle' ) ) {
				while ( have_rows( 'columns_middle' ) ) {
					the_row();
					$component_name = get_row_layout();
					require TEMPLATEPATH . '/components/' . $component_name . '/' . $component_name . '.php';
				}
			} elseif ( have_posts() ) {
				while ( have_posts() ) : the_post();
					the_content();
				endwhile;
			}
			?>
		</div>
		<?php if ( have_rows( 'columns_right' ) ) : ?>
			<div class="ya-sidebar">
				<?php
				while ( have_rows( 'columns_right' ) ) {
					the_row();
					$sidebar_classes = get_sidebar_classes();
					while ( have_rows( 'sidebar_components' ) ) {
						the_row();
						require TEMPLATEPATH . '/components/columns/columns_sidebar_before.php';
						$component_name = get_row_layout();
						require TEMPLATEPATH . '/components/' . $component_name . '/' . $component_name . '.php';
						require TEMPLATEPATH . '/components/columns/columns_sidebar_after.php';
					}
				}
				?>
			</div>
		<?php endif; ?>
	</div>
</div>
