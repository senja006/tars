<div class="ya-content">
	<div class="ya-container">
		<div class="ya-content__row">
			<div class="ya-content__main">
				<?php
				if(function_exists('carbon_get_the_post_meta')) {
					$page_id = isset( $page_id ) ? $page_id : get_the_ID();
                	$components = carbon_get_post_meta( $page_id, 'components', 'complex' );
					foreach ( $components as $component ) {
						$carbon_data    = carbon_get_component_data( $component );
						$component      = $carbon_data[0];
						$component_name = $carbon_data[1];
						$path = TEMPLATEPATH . '/markup/components/' . $component_name . '/' . $component_name . '.php';
						if(file_exists($path)) {
							require $path;
						}
					}
				}
				?>
			</div>
		</div>
	</div>
</div>
