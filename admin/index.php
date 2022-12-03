<?php
session_start();
if (!isset($_SESSION['user_email'])) {
    header('Location: login.php');
    exit;
} else {
    // Show users the page!
}
include_once "model/conexion.php";
$sentencia = $bd->query("SELECT
l.id_locacion as 'id_locacion',
l.nombre_locacion as 'nombre_locacion',
l.label_locacion as 'label_locacion',
COALESCE(a.correo, '') as 'admin_locacion'
FROM locaciones l LEFT JOIN admin_locaciones a ON l.id_locacion = a.id_locacion");

$locacion = $sentencia->fetchAll(PDO::FETCH_OBJ);

$email = $_SESSION['user_email'];
$sentencia2 = $bd->prepare("select id_campus from admin_campus where correo = ?;");
$sentencia2->execute([$email]);
$resultado = $sentencia2->fetch(PDO::FETCH_OBJ);
$id_campus = $resultado->id_campus;

$sentencia3 = $bd->prepare("select nombre_campus, informacion_campus from campus where id_campus = ?;");
$sentencia3->execute([$id_campus]);
$resultado2 = $sentencia3->fetch(PDO::FETCH_OBJ);
$nombre_campus = $resultado2->nombre_campus;
$ubicacion_campus = $resultado2->informacion_campus;
?>
<!doctype html>
<html lang="es">

<head>
    <title>Administración</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" href="/css/style.css">

    <!-- Bootstrap CSS v5.0.2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <!-- cdn icnonos-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</head>

<body>
    <div class="container-fluid bg-warning">
        <div class="row">
            <div class="col-md">
                <header class="py-3">
                    <h4 class="text-center">Administración: <?php echo($email ." - ".$nombre_campus)?></h4>
                    <h5 class="text-center"><?php echo($ubicacion_campus)?></h5>
                    <nav class="navbar navbar-light bg-warning">
                        <a class="nav-item" href="index.php">Inicio</a>
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item">
                                <a class="nav-item" href="logout.php">Cerrar sesión</a>
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
        </div>
    </div>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <!-- inicio alerta -->
                <?php
                if (isset($_GET['mensaje']) and $_GET['mensaje'] == 'falta') {
                ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> Rellena todos los campos.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                <?php
                }
                ?>


                <?php
                if (isset($_GET['mensaje']) and $_GET['mensaje'] == 'registrado') {
                ?>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Registrado!</strong> Se agregaron los datos.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                <?php
                }
                ?>
                <?php
                if (isset($_GET['mensaje']) and $_GET['mensaje'] == 'login') {
                ?>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Bienvenido!</strong> Has iniciado sesión correctamente!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                <?php
                }
                ?>


                <?php
                if (isset($_GET['mensaje']) and $_GET['mensaje'] == 'error') {
                ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> Vuelve a intentar.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                <?php
                }
                ?>



                <?php
                if (isset($_GET['mensaje']) and $_GET['mensaje'] == 'editado') {
                ?>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Cambiado!</strong> Los datos fueron actualizados.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                <?php
                }
                ?>


                <?php
                if (isset($_GET['mensaje']) and $_GET['mensaje'] == 'eliminado') {
                ?>
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>Eliminado!</strong> Los datos fueron borrados.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                <?php
                }
                ?>

                <!-- fin alerta -->
                <div class="card">
                    <div class="card-header">
                        Lista de locaciones
                    </div>
                    <div class="p-4">
                        <table class="table align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Etiqueta</th>
                                    <th scope="col">Admin</th>
                                    <th scope="col" colspan="2">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>

                                <?php
                                foreach ($locacion as $dato) {
                                ?>

                                    <tr>
                                        <td scope="row"><?php echo $dato->id_locacion; ?></td>
                                        <td><?php echo $dato->nombre_locacion; ?></td>
                                        <td><?php echo $dato->label_locacion; ?></td>
                                        <td><?php echo $dato->admin_locacion; ?></td>
                                        <td><a class="text-success" href="editar.php?id_locacion=<?php echo $dato->id_locacion; ?>"><i class="bi bi-pencil-square"></i></a></td>
                                        <td><a onclick="return confirm('Estas seguro de eliminar?');" class="text-danger" href="eliminar.php?codigo=<?php echo $dato->id_locacion; ?>"><i class="bi bi-trash"></i></a></td>
                                    </tr>

                                <?php
                                }
                                ?>

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        Ingresar nueva locación:
                    </div>
                    <form class="p-4" method="POST" action="registrar.php">
                        <div class="mb-3">
                            <label class="form-label">Nombre: </label>
                            <input type="text" class="form-control" name="txtNombre" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Label: </label>
                            <input type="text" class="form-control" name="txtLabel" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Latitud: </label>
                            <input type="text" class="form-control" name="txtLatitud" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Longitud: </label>
                            <input type="text" class="form-control" name="txtLongitud" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Tipo: </label>
                            <input type="text" class="form-control" name="txtTipo" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Administrador: </label>
                            <input type="email" class="form-control" name="txtemail" autofocus required>
                        </div>
                        <div class="d-grid">
                            <input type="hidden" name="oculto" value="1">
                            <input type="submit" class="btn btn-primary" value="Registrar">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <?php include 'template/footer.php' ?>