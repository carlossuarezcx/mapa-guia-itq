<?php
    print_r($_POST);
    if(!isset($_POST['id_locacion'])){
        header('Location: index.php?mensaje=error');
    }

    include 'model/conexion.php';
    $id_locacion = $_POST['id_locacion'];
    $new_admin = $_POST['new_admin'];

    $sentencia = $bd->prepare("UPDATE admin_locaciones SET id_locacion = ? where correo = ?;");
    $resultado = $sentencia->execute([$id_locacion, $new_admin]);

    if ($resultado === TRUE) {
        header('Location: index.php?mensaje=editado');
    } else {
        header('Location: index.php?mensaje=error');
        exit();
    }
    
?>