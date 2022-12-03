<?php include 'template/header.php' ?>

<?php
    if(!isset($_GET['id_subdepartamento'])){
        header('Location: admin_editor.php?mensaje=error');
        exit();
    }

    include_once 'model/conexion.php';
    $id_sub = $_GET['id_subdepartamento'];

    $sentencia = $bd->prepare("select * from subdepartamentos where id_subdepartamento = ?;");
    $sentencia->execute([$id_sub]);
    $sub = $sentencia->fetch(PDO::FETCH_OBJ);

?>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    Editar datos subdepartamento:
                </div>
                <form class="p-4" method="POST" action="editarProcesoSubdepartamento.php">
                    <div class="mb-3">
                        <label class="form-label">Locacion: </label>
                        <input type="text" class="form-control" name="txtLocacion" disabled 
                        value="<?php echo $sub->id_locacion; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nombre: </label>
                        <input type="text" class="form-control" name="txtNombre" required 
                        value="<?php echo $sub->nombre; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Horario: </label>
                        <input type="text" class="form-control" name="txtHorario" autofocus required
                        value="<?php echo $sub->horario; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Detalles: </label>
                        <input type="text" class="form-control" name="txtDetalles" autofocus required
                        value="<?php echo $sub->detalles; ?>">
                    </div>
                    <div class="d-grid">
                        <input type="hidden" name="id_subdepartamento" value="<?php echo $sub->id_subdepartamento; ?>">
                        <input type="submit" class="btn btn-primary" value="Editar">
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'template/footer.php' ?>