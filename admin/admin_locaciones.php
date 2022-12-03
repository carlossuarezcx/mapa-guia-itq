<?php
session_start();
if (!isset($_SESSION['user_email'])) {
    header('Location: login.php');
    exit;
} else {
}
include_once "model/conexion.php";
$email = $_SESSION['user_email'];
$rol = $_SESSION['user_rol'];
//OBTENER LA LOCACIONES ATRAVÉS DEL CORREO LAS CUALES SON DEL ID ADMIN
$sentencia = $bd->prepare("SELECT l.id_locacion as 'id_locacion', l.nombre_locacion as 'nombre_locacion', l.label_locacion as 'label_locacion' 
FROM locaciones l 
RIGHT JOIN admin_locaciones a ON l.id_locacion = a.id_locacion WHERE a.correo = ?");
$sentencia->execute([$email]);
$locacion = $sentencia->fetchAll(PDO::FETCH_OBJ);
//OBTENER LA ID LOCACION
$sentencia2 = $bd->prepare("select id_locacion from admin_locaciones where correo = ?;");
$sentencia2->execute([$email]);
$resultado = $sentencia2->fetch(PDO::FETCH_OBJ);
$id_locacion = $resultado->id_locacion;

//OBTENER SUBDEPARTAMENTOS
$sentencia3 = $bd->prepare("SELECT l.id_subdepartamento as 'id', l.nombre as 'nombre', l.horario as 'horario', l.encargado as 'encargado',   l.detalles as 'detalles'
FROM subdepartamentos l 
INNER JOIN locaciones a ON l.id_locacion = a.id_locacion WHERE l.id_locacion = ?");
$sentencia3->execute([$id_locacion]);
$subdepartamentos = $sentencia3->fetchAll(PDO::FETCH_OBJ);

//obtener administradores de la locacion
$sentencia4 = $bd->prepare("SELECT id_administrador, nombre, correo,numero, rol FROM admin_locaciones WHERE id_locacion = ?");
$sentencia4->execute([$id_locacion]);
$administradores = $sentencia4->fetchAll(PDO::FETCH_OBJ);


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
                    <h4 class="text-center">Administración: <?php echo ($email) ?></h4>
                    <nav class="navbar navbar-light bg-warning">
                        <a class="nav-item" href="admin_locaciones.php">Inicio</a>
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
                        Lista de locaciones permitidas
                    </div>
                    <div class="p-4">
                        <table class="table align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Etiqueta</th>
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
                                    </tr>
                                <?php
                                }
                                ?>

                            </tbody>
                        </table>

                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Lista de sub-departamentos
                    </div>
                    <div class="p-4">
                        <table class="table align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Horario</th>
                                    <th scope="col">Encargado</th>
                                    <th scope="col">Detalles</th>
                                    <th scope="col" colspan="2">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>

                                <?php
                                foreach ($subdepartamentos as $datosub) {
                                ?>
                                    <tr>
                                        <td scope="row"><?php echo $datosub->id; ?></td>
                                        <td><?php echo $datosub->nombre; ?></td>
                                        <td><?php echo $datosub->horario; ?></td>
                                        <td><?php echo $datosub->encargado; ?></td>
                                        <td><?php echo $datosub->detalles; ?></td>
                                        <td><a onclick="return confirm('Estas seguro de eliminar?');" class="text-danger" href="eliminarSubdepartamento.php?id_subdepartamento=<?php echo $datosub->id; ?>"><i class="bi bi-trash"></i></a></td>
                                    </tr>
                                <?php
                                }
                                ?>
                                <!-- <td><a class="text-success" href="editarSubdepartamento.php?id_subdepartamento=<?php echo $datosub->id; ?>"><i class="bi bi-pencil-square"></i></a></td> -->

                            </tbody>
                        </table>

                    </div>
                </div>


                <div class="card">
                    <div class="card-header">
                        Lista de encargados y editores
                    </div>
                    <div class="p-4">
                        <table class="table align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Correo</th>
                                    <th scope="col">Rol</th>
                                    <th scope="col" colspan="2">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>

                                <?php
                                foreach ($administradores as $admin) {
                                ?>
                                    <tr>
                                        <td scope="row"><?php echo $admin->nombre; ?></td>
                                        <td><?php echo $admin->correo; ?></td>
                                        <td><?php echo $admin->numero; ?></td>
                                        <td><?php echo $admin->rol; ?></td>
                                        <td><a class="text-success" href="editarEncargado.php?id_administrador=<?php echo $admin->id_administrador; ?>"><i class="bi bi-pencil-square"></i></a></td>
                                        <td><a onclick="return confirm('Estas seguro de eliminar?');" class="text-danger" href="eliminarEncargado.php?id_administrador=<?php echo $admin->id_administrador; ?>"><i class="bi bi-trash"></i></a></td>
                                    </tr>
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
                        Ingresar nuevo subdepartamento:
                    </div>
                    <form class="p-4" method="POST" action="registrarSubdepartamento.php">
                        <div class="mb-3">
                            <label class="form-label">Nombre locacion: </label>
                            <input type="text" class="form-control" name="txtLocacion" disabled value="<?php echo $dato->nombre_locacion; ?>">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nombre sub-departamento: </label>
                            <input type="text" class="form-control" name="txtNombre" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Horario: </label>
                            <input type="text" class="form-control" name="txtHorario" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Descripción: </label>
                            <input type="text" class="form-control" name="txtDescripcion" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Encargado: </label>
                            <select name=txtEncargado class="form-control">
                                <option value="">Seleccione:</option>
                                <?php
                                $query = $bd->prepare("SELECT id_administrador, nombre FROM admin_locaciones");
                                $query->execute();
                                $data = $query->fetchAll();

                                foreach ($data as $valores) :
                                    echo '<option value="' . $valores["id_administrador"] . '">' . $valores["nombre"] . '</option>';
                                endforeach;
                                ?>
                            </select>
                        </div>
                        <div class="d-grid">
                            <input type="hidden" name="idlocacion" value="<?php echo $id_locacion ?>">
                            <input type="hidden" name="oculto" value="1">
                            <input type="submit" class="btn btn-primary" value="Registrar">
                        </div>
                    </form>
                </div>
                <div class="card">
                    <div class="card-header">
                        Ingresar nuevo editor:
                    </div>
                    <form class="p-4" method="POST" action="registrarEncargado.php">
                        <div class="mb-3">
                            <label class="form-label">Nombre locacion: </label>
                            <input type="text" class="form-control" name="txtLocacion" disabled value="<?php echo $dato->nombre_locacion; ?>">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nombre </label>
                            <input type="text" class="form-control" name="nombre" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Numero: </label>
                            <input type="text" class="form-control" name="numero" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Correo: </label>
                            <input type="text" class="form-control" name="correo" autofocus required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">password: </label>
                            <input type="password" class="form-control" name="password" autofocus required>
                        </div>
                        <div class="d-grid">
                            <input type="hidden" name="idlocacion" value="<?php echo $id_locacion ?>">
                            <input type="hidden" name="oculto" value="1">
                            <input type="submit" class="btn btn-primary" value="Registrar">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <?php include 'template/footer.php' ?>