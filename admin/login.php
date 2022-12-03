<?php include 'template/header.php' ?>
<?php
include_once "model/conexion.php";
session_start();
if (isset($_POST['login'])) {

    $email = $_POST['email'];
    $password = $_POST['password'];
    $query = $bd->prepare("SELECT * FROM admin_campus WHERE correo=:email");
    $query->bindParam("email", $email, PDO::PARAM_STR);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);

    $rowcounts = $query->rowCount();

    if($rowcounts==0){
        $query2 = $bd->prepare("SELECT * FROM admin_locaciones WHERE correo=:email");
        $query2->bindParam("email", $email, PDO::PARAM_STR);
        $query2->execute();
        $result2 = $query2->fetch(PDO::FETCH_ASSOC);
        if (!$result2) {
            echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Usuario o contraseña no valido.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>';
        } else {
            if ($password == $result2['password']) {
                echo '<div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Bienvenido!</strong> Has iniciado sesión!.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>';
                $_SESSION['user_rol'] = $result2['rol'];
                $_SESSION['user_email'] = $result2['correo'];
                if($result2['rol'] == "editor"){
                    header('Location: admin_editor.php');
                }else{
                    header('Location: admin_locaciones.php');
                }

            } else {
                echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Usuario o contraseña no valido.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>';
            }
        }
    }else{
        if (!$result) {
            echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Usuario o contraseña no valido.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>';
        } else {
            if ($password == $result['password']) {
                echo '<div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Bienvenido!</strong> Has iniciado sesión!.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>';
                $_SESSION['user_rol'] = $result['rol'];
                $_SESSION['user_email'] = $result['correo'];
                header('Location: index.php');
            } else {
                echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Usuario o contraseña no valido.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>';
            }
        }
    }

}
?>
<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    Iniciar sesión
                </div>
                <form class="p-4" method="POST" action="" name="signin-form">
                    <div class="mb-3">
                    </div>
                    <label class="form-label">Correo</label>
                    <input type="email" class="form-control" name="email" required">
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control" name="password" required>
                    </div>
                    <div class="d-grid">
                        <button type="submit" name="login" value="login">Iniciar sesión</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<?php include 'template/footer.php' ?>