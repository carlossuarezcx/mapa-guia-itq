<?php
    //print_r($_POST);
    if(empty($_POST["oculto"]) || empty($_POST["txtNombre"]) || empty($_POST["txtLabel"]) || empty($_POST["txtLatitud"]) 
        || empty($_POST["txtLongitud"])|| empty($_POST["txtTipo"]) || empty($_POST["txtemail"])){
        header('Location: index.php?mensaje=falta');
        exit();
    }
    include_once 'model/conexion.php';
    $nombre = $_POST["txtNombre"];
    $label = $_POST["txtLabel"];
    $latitud = $_POST["txtLatitud"];
    $longitud = $_POST["txtLongitud"];
    $tipo = $_POST["txtTipo"];
    $email = $_POST["txtemail"];
    
    
    $sentencia = $bd->prepare("INSERT INTO locaciones(nombre_locacion,label_locacion,id_campus,latitud_locacion,longitud_locacion,tipo_locacion,admin_locacion) VALUES (?,?,?,?,?,?,?);");
    $resultado = $sentencia->execute([$nombre,$label,$latitud,$longitud,$tipo,$email]);

    if ($resultado === TRUE) {
        header('Location: index.php?mensaje=registrado');
    } else {
        header('Location: index.php?mensaje=error');
        exit();
    }
    
?>