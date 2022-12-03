<?php
    //print_r($_POST);
    if(empty($_POST["oculto"])  || empty($_POST["nombre"]) || empty($_POST["numero"]) 
        || empty($_POST["correo"])|| empty($_POST["password"]) || empty($_POST["idlocacion"])){
        header('Location: admin_locaciones.php?mensaje=falta');
        exit();
    }
    include_once 'model/conexion.php';
    $nombre = $_POST["nombre"];
    $numero = $_POST["numero"];
    $correo = $_POST["correo"];
    $pwd = $_POST["password"];
    $idlocacion = $_POST["idlocacion"];
    $rol="editor";

    
    $sentencia = $bd->prepare("INSERT INTO admin_locaciones(nombre,id_locacion,numero,correo,password,rol) VALUES (?,?,?,?,?,?);");
    $resultado = $sentencia->execute([$nombre,$idlocacion,$numero,$correo,$pwd,$rol]);

    if ($resultado === TRUE) {
        header('Location: admin_locaciones.php?mensaje=registrado');
    } else {
        header('Location: admin_locaciones.php?mensaje=error');
        exit();
    }
    
?>