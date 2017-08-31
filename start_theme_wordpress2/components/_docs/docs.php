<?php

$docs_link = get_field( 'doc' )['url'];
$docs_type = array_pop( explode( '/', get_field( 'doc' )['mime_type'] ) );

if ( $docs_type != 'doc' && $docs_type != 'pdf' ) {
	$docs_type = 'doc';
}

if ( get_sub_field( 'name' ) ) {
	$docs_name = get_sub_field( 'name' );
} else if ( ! $docs_name ) {
	$docs_name = get_field( 'doc' )['name'];
}
?>

<?php if ( $docs_link ) : ?>
	<div class="ya-docs">
		<div class="ya-docs__container">
			<div class="ya-docs__list">
				<ul class="ya-docs__list-ul">
					<li class="ya-docs__list-li">
						<div class="ya-docs__list-img">
							<span class="ya-icon ya-icon--<?php echo $docs_type; ?>"></span>
						</div>
						<a href="<?php echo $docs_link; ?>" class="ya-docs__list-a"><?php echo $docs_name; ?></a>
					</li>
				</ul>
			</div>
		</div>
	</div>
<?php endif; ?>
