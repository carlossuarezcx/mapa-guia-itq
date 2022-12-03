<?php 
    if(!isset($_GET['id_administrador'])){
        header('Location: admin_locaciones.php?mensaje=error');
        exit();
    }

    include 'model/conexion.php';
    $id = $_GET['id_administrador'];

    $sentencia = $bd->prepare("DELETE FROM admin_locaciones where id_administrador = ?;");
    $resultado = $sentencia->execute([$id]);

    if ($resultado === TRUE) {
        header('Location: admin_locaciones.php?mensaje=eliminado');
    } else {
        header('Location: admin_locaciones.php?mensaje=error');
    }
    
?>