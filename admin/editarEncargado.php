<?php include 'template/header.php' ?>

<?php
    if(!isset($_GET['id_administrador'])){
        header('Location: admin_locaciones.php?mensaje=error');
        exit();
    }

    include_once 'model/conexion.php';
    $id_admin = $_GET['id_administrador'];

    $sentencia = $bd->prepare("select * from admin_locaciones where id_administrador = ?;");
    $sentencia->execute([$id_admin]);
    $admin = $sentencia->fetch(PDO::FETCH_OBJ);

?>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    Editar datos de encargado:
                </div>
                <form class="p-4" method="POST" action="editarProcesoEncargado.php">
                    <div class="mb-3">
                        <label class="form-label">Nombre </label>
                        <input type="text" class="form-control" name="txtNombre" required 
                        value="<?php echo $admin->nombre; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo: </label>
                        <input type="email" class="form-control" name="txtCorreo" required 
                        value="<?php echo $admin->correo; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Numero: </label>
                        <input type="text" class="form-control" name="txtNumero" autofocus required
                        value="<?php echo $admin->numero; ?>">
                    </div>
                    <div class="d-grid">
                        <input type="hidden" name="id_administrador" value="<?php echo $admin->id_administrador; ?>">
                        <input type="submit" class="btn btn-primary" value="Editar">
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'template/footer.php' ?>