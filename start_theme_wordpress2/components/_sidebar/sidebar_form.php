<?php
$order_mobile = ! empty( $instance['order_mobile'] ) ? $instance['order_mobile'] : 0;
?>

<div class="widget-title"><b>Настройки расположения</b></div>
<p>
	<label for="<?php echo $this->get_field_id( 'order_mobile' ); ?>">Порядок на мобильных устройствах:</label>
	<input class="widefat" id="<?php echo $this->get_field_id( 'order_mobile' ); ?>"
	       name="<?php echo $this->get_field_name( 'order_mobile' ); ?>" type="text"
	       value="<?php echo esc_attr( $order_mobile ); ?>"/>
</p>
<p>
	<input type="checkbox" id="<?php echo $this->get_field_id( 'flex_grow' ); ?>"
	       name="<?php echo $this->get_field_name( 'flex_grow' ); ?>"
	       value="ya-grow" <?php checked( $flex_grow, 'ya-grow' ); ?>>
	<label for="<?php echo $this->get_field_id( 'flex_grow' ); ?>">отображать только на десктопе</label>
</p>
