<?php
	/*
        Clase para crear la conexion
	*/
	class Conexion extends PDO
	{	
		/*variables para xampp
		private $hostBd = 'localhost';
		private $nombreBd = 'id18987531_sinfilas2020';
		private $usuarioBd = 'id18987531_root';
		private $passwordBd = 'F(y=cGNnOi7-QwL]';
		*/
		/*
		private $hostBd = 'localhost';
		private $nombreBd = 'proyecto_mapaitq';
		private $usuarioBd = 'root';
		private $passwordBd = '';
		*/
		private $hostBd = 'localhost';
		private $nombreBd = 'id19780604_mapaguiaitq';
		private $usuarioBd = 'id19780604_mapa';
		private $passwordBd = '~U/Sv2@qvOE#dDsk';
		public function __construct()
		{
			try{
				parent::__construct('mysql:host=' . $this->hostBd . ';dbname=' . $this->nombreBd . ';charset=utf8', $this->usuarioBd, $this->passwordBd, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
				} catch(PDOException $e){
				echo 'Error: ' . $e->getMessage();
				
				exit;
			}
		}
	}
?>