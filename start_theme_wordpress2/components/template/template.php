<?php
/**
 * Output sidebar
 */
?>
<?php dynamic_sidebar( 'name_sidebar' ); ?>

===================
<?php
/**
 * Output email
 */
?>
<a href="mailto:<?php echo antispambot( esc_attr( $email ) ); ?>"
   class="ya-contacts-info__list-a"><?php echo antispambot( $email ); ?></a>

===================
<?php
/**
 * Custom post type and the taxonomies
 */

$category_reviews_id = get_sub_field( 'category_reviews' );
$reviews             = new WP_Query( array(
	'post_type'      => 'reviews',
	'post_status'    => 'publish',
	'posts_per_page' => - 1,
	'tax_query'      => array(
		array(
			'taxonomy' => 'category_reviews',
			'field'    => 'id',
			'terms'    => $category_reviews_id
		)
	)
) );
?>

==================
<?php
/**
 * Sort by meta
 */

$tests = new WP_Query( array(
	'post_type'      => 'test',
	'post_status'    => 'publish',
	'posts_per_page' => - 1,
	'meta_key'       => 'sort',
	'orderby'        => 'meta_value_num',
	'order'          => 'ASC'
) );

wp_reset_postdata();

?>


<?php
/**
 * Create current url
 */

$current_url = strtolower(explode('/', $_SERVER['SERVER_PROTOCOL'])[0]) . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
?>

<?php

/**
 * Number format (001)
 */

str_pad( $num, 3, '0', STR_PAD_LEFT );

?>

<?php
/**
 * Output image
 */
?>
<img src="<?php echo wp_get_attachment_image_src( $component['bg_img'], 'home_banner_bg' )[0]; ?>" alt="<?php echo esc_attr( get_post_meta( $component['bg_img'], '_wp_attachment_image_alt', true ) ); ?>">
<img src="{{ wp_get_attachment_image_src( $item['img'], 'quarter_content' )[0] }}" srcset="{{ wp_get_attachment_image_src( $item['img'], 'quarter_content' )[0] }} 1x, {{ wp_get_attachment_image_src( $item['img'], 'quarter_content_retina' )[0] }} 2x" alt="{{ get_post_meta( $item['img'], '_wp_attachment_image_alt', true ) }}">

<style>
    .banner {
        background-image: url({{ wp_get_attachment_image_src( $component['img'], 'banner' )[0] }});
    }

    @media screen and (min-resolution: 192dpi), screen and (-webkit-min-device-pixel-ratio: 2) {
        .banner {
            background-image: url({{ wp_get_attachment_image_src( $component['img'], 'banner_retina' )[0] }});
        }
    }
</style>


<?php
/**
 * Output field of component by carbon
 */
?>
<?php if(isset($component['']) && $component['']) : ?>
	<?php echo $component['']; ?>
<?php endif; ?>








