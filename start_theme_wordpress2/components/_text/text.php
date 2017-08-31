<?php
$cols_num = 0;
if ( have_rows( 'cols_list' ) ) {
	while ( have_rows( 'cols_list' ) ) {
		the_row();
		$cols_num ++;
	}
}
?>

<?php if ( have_rows( 'cols_list' ) ) : ?>
	<div class="ya-text ya-typography-styles">
		<div class="ya-text__row ya-cols-<?php echo $cols_num; ?>">
			<?php while ( have_rows( 'cols_list' ) ) : the_row(); ?>
				<div class="ya-col">
					<?php the_sub_field( 'text' ); ?>
				</div>
			<?php endwhile; ?>
		</div>
	</div>
<?php endif; ?>
