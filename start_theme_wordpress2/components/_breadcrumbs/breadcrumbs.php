<div
	class="ya-breadcrumbs <?php if ( get_sub_field( 'margin_left_as_width_sidebar' ) ) : ?> ya-margin-left <?php endif; ?>">
	<?php if ( get_sub_field( 'is_only_start_end' ) ) : ?>
		<ul class="ya-breadcrumbs__ul">
			<li class="ya-breadcrumbs__li">
				<a href="<?php echo home_url(); ?>" class="ya-breadcrumbs__text">Главная</a>
			</li>
			<li class="ya-breadcrumbs__li">
				<span class="ya-breadcrumbs__text"><?php the_title(); ?></span>
			</li>
		</ul>
	<?php else : ?>
		<?php echo kama_breadcrumbs( '', array(), array(
			'markup'     => array(
				'wrappatt'  => '<ul class="ya-breadcrumbs__ul">%s</ul>',
				'linkpatt'  => ' <li class="ya-breadcrumbs__li"> <a class="ya-breadcrumbs__text" href="%s">%s</a> </li> ',
				'sep_after' => ''
			),
			'title_patt' => ' <li class="ya-breadcrumbs__li"> <span class="ya-breadcrumbs__text">%s</span> </li>'
		) ); ?>
	<?php endif; ?>
</div>
