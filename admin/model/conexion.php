<?php 

$hostBd = 'localhost';
$nombreBd = 'id19780604_mapaguiaitq';
$usuarioBd = 'id19780604_mapa';
$passwordBd = '~U/Sv2@qvOE#dDsk';
try {
	$bd = new PDO (
		'mysql:host=localhost;
		dbname='.$nombreBd,
		$usuarioBd,
		$passwordBd,
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
	);
} catch (Exception $e) {
	echo "Problema con la conexion: ".$e->getMessage();
}
?>