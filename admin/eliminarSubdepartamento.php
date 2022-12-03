<?php 
    if(!isset($_GET['id_subdepartamento'])){
        header('Location: admin_locaciones.php?mensaje=error');
        exit();
    }

    include 'model/conexion.php';
    $id = $_GET['id_subdepartamento'];

    $sentencia = $bd->prepare("DELETE FROM subdepartamentos where id_subdepartamento = ?;");
    $resultado = $sentencia->execute([$id]);

    if ($resultado === TRUE) {
        header('Location: admin_locaciones.php?mensaje=eliminado');
    } else {
        header('Location: admin_locaciones.php?mensaje=error');
    }
    
?>