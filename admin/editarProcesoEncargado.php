<?php
    print_r($_POST);
    if(!isset($_POST['id_administrador'])){
        header('Location: admin_locaciones.php?mensaje=error');
    }

    include 'model/conexion.php';
    $nombre = $_POST['txtNombre'];
    $correo = $_POST['txtCorreo'];
    $id_administrador = $_POST['id_administrador'];
    $numero = $_POST['txtNumero'];

    $sentencia = $bd->prepare("UPDATE admin_locaciones SET nombre = ? ,correo = ? , numero = ? where id_administrador = ?;");
    $resultado = $sentencia->execute([$nombre,$correo, $numero,$id_administrador]);

    if ($resultado === TRUE) {
        header('Location: admin_locaciones.php?mensaje=editado');
    } else {
        header('Location: admin_locaciones.php?mensaje=error');
        exit();
    }
    
?>