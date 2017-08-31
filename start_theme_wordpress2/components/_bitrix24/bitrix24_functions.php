<?php

require_once 'Bitrix24.php';

/*
 * Данные для подключения
 */
define( 'BITRIX_24_HOST', 'pskvector.bitrix24.ru' ); // your CRM domain name
define( 'BITRIX_24_PORT', '443' ); // CRM server port
define( 'BITRIX_24_PATH', '/crm/configs/import/lead.php' ); // CRM server REST service path

/*
 * Данные для авторизации
 */
define( 'BITRIX_24_LOGIN', '' ); // login of a CRM user able to manage leads
define( 'BITRIX_24_PASSWORD', '' ); // password of a CRM user
//define('BITRIX_24_AUTH', 'e54ec19f0c5f092ea11145b80f465e1a'); // authorization hash