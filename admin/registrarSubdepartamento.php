<?php
    //print_r($_POST);
    if(empty($_POST["oculto"])  || empty($_POST["txtNombre"]) || empty($_POST["txtHorario"]) 
        || empty($_POST["txtDescripcion"])|| empty($_POST["txtEncargado"]) || empty($_POST["idlocacion"])){
        header('Location: admin_locaciones.php?mensaje=falta');
        exit();
    }
    include_once 'model/conexion.php';
    $encargado = $_POST["txtEncargado"];
    $sentencia2 = $bd->prepare("select correo from admin_locaciones where id_administrador = ?;");
    $sentencia2->execute([$encargado]);
    $resultado2 = $sentencia2->fetch(PDO::FETCH_OBJ);
    $correo = $resultado2->correo;


    $nombresubdepartamento = $_POST["txtNombre"];
    $horario = $_POST["txtHorario"];
    $detalles = $_POST["txtDescripcion"];
    $idlocacion = $_POST["idlocacion"];
    
    
    $sentencia = $bd->prepare("INSERT INTO subdepartamentos(id_locacion,nombre,horario,encargado,detalles) VALUES (?,?,?,?,?);");
    $resultado = $sentencia->execute([$idlocacion,$nombresubdepartamento,$horario,$correo,$detalles]);

    if ($resultado === TRUE) {
        header('Location: admin_locaciones.php?mensaje=registrado');
    } else {
        header('Location: admin_locaciones.php?mensaje=error');
        exit();
    }
    
?>