<?php
    print_r($_POST);
    if(!isset($_POST['id_subdepartamento'])){
        header('Location: admin_editor.php?mensaje=error');
    }

    include 'model/conexion.php';
    $nombre = $_POST['txtNombre'];
    $horario = $_POST['txtHorario'];
    $detalles = $_POST['txtDetalles'];
    $id_subdepartamento = $_POST['id_subdepartamento'];

    $sentencia = $bd->prepare("UPDATE subdepartamentos SET nombre = ? ,horario = ? , detalles = ? where id_subdepartamento = ?;");
    $resultado = $sentencia->execute([$nombre,$horario, $detalles,$id_subdepartamento]);

    if ($resultado === TRUE) {
        header('Location: admin_editor.php?mensaje=editado');
    } else {
        header('Location: admin_editor.php?mensaje=error');
        exit();
    }
    
?>