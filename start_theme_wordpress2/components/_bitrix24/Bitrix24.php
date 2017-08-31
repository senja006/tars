<?php

class Bitrix24 {

	private $send_data = array();

	function __construct( $data ) {
		$self = $this;

		foreach ( $data as $key => $value ) {
			$self->send_data[ $key ] = $value;
		}

		if ( defined( 'BITRIX_24_AUTH' ) ) {
			$self->send_data['AUTH'] = BITRIX_24_AUTH;
		} else {
			$self->send_data['LOGIN']    = BITRIX_24_LOGIN;
			$self->send_data['PASSWORD'] = BITRIX_24_PASSWORD;
		}
	}

	public function send() {
		$fp = fsockopen( "ssl://" . BITRIX_24_HOST, BITRIX_24_PORT, $errno, $errstr, 30 );

		if ( ! $fp ) {
			return false;
		} else {
			$data = $this->get_str_data();

			fwrite( $fp, $data );

			$result = '';
			while ( ! feof( $fp ) ) {
				$result .= fgets( $fp, 128 );
			}
			fclose( $fp );

			return true;
		}
	}

	private function get_str_data() {
		$data = '';
		foreach ( $this->send_data as $key => $value ) {
			$data .= ( $data == '' ? '' : '&' ) . $key . '=' . urlencode( $value );
		}

		$str = "POST " . BITRIX_24_PATH . " HTTP/1.0\r\n";
		$str .= "Host: " . BITRIX_24_HOST . "\r\n";
		$str .= "Content-Type: application/x-www-form-urlencoded\r\n";
		$str .= "Content-Length: " . strlen( $data ) . "\r\n";
		$str .= "Connection: close\r\n\r\n";

		$str .= $data;

		return $str;
	}

}