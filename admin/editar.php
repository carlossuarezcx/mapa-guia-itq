<?php include 'template/header.php' ?>

<?php
    if(!isset($_GET['id_locacion'])){
        header('Location: index.php?mensaje=error');
        exit();
    }

    include_once 'model/conexion.php';
    $codigo = $_GET['id_locacion'];

    $sentencia = $bd->prepare("select * from locaciones where id_locacion = ?;");
    $sentencia->execute([$codigo]);
    $locacion = $sentencia->fetch(PDO::FETCH_OBJ);

?>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    Editar datos:
                </div>
                <form class="p-4" method="POST" action="editarProceso.php">
                    <div class="mb-3">
                        <label class="form-label">Nombre locacion: </label>
                        <input type="text" class="form-control" name="txtNombre" disabled 
                        value="<?php echo $locacion->nombre_locacion; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Administrador: </label>
                        <input type="email" class="form-control" name="new_admin" autofocus required
                        value="<?php echo $locacion->admin_locacion; ?>">
                    </div>
                    <div class="d-grid">
                        <input type="hidden" name="id_locacion" value="<?php echo $locacion->id_locacion; ?>">
                        <input type="submit" class="btn btn-primary" value="Editar">
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'template/footer.php' ?>