<?php
header('Content-Type: text/html; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include 'connect.php';
$pdo = new Conexion();
$_POST = apache_request_headers();
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['request'])) {
            $Solicitud = $_GET['request'];
            switch ($Solicitud) {
                case 'getLocaciones':
                    $sql = $pdo->prepare("
                        SELECT
                            id_locacion,	
                            nombre_locacion,	
                            descripcion_locacion,	
                            id_campus,	
                            latitud_locacion,	
                            longitud_locacion,
                            tipo_locacion
                        FROM locaciones ");
                    $sql->execute();
                    header("HTTP/1.1 200 ok");
                    $sql->setFetchMode(PDO::FETCH_ASSOC);
                    echo json_encode($sql->fetchAll(), JSON_UNESCAPED_UNICODE);
                    exit;
                    break; 
                case 'getLocacionesMarkers':
                    $sql = $pdo->prepare("
                        SELECT
                            nombre_locacion,
                            label_locacion,
                            latitud_locacion,	
                            longitud_locacion,
                            tipo_locacion
                        FROM locaciones");
                    $sql->execute();
                    header("HTTP/1.1 200 ok");
                    $sql->setFetchMode(PDO::FETCH_ASSOC);
                    echo json_encode($sql->fetchAll(), JSON_UNESCAPED_UNICODE);
                    exit;
                    break;  
                case 'getLocationPath':
                    $a =  $_GET['a'];
                        $sql = $pdo->prepare("
                            SELECT
                                latitud_locacion,	
                                longitud_locacion
                            FROM locaciones 
                            WHERE label_locacion = '$a'");
                        $sql->execute();
                        header("HTTP/1.1 200 ok");
                        $sql->setFetchMode(PDO::FETCH_ASSOC);
                        echo json_encode($sql->fetchAll(), JSON_UNESCAPED_UNICODE);
                        exit;
                        break;   
                        
                case 'getInfoEdificio':
                    $lbl =  $_GET['lbl'];
                        $sql = $pdo->prepare("
                            SELECT
                                *
                            FROM locaciones 
                            WHERE label_locacion = '$lbl'");
                        $sql->execute();
                        header("HTTP/1.1 200 ok");
                        $sql->setFetchMode(PDO::FETCH_ASSOC);
                        echo json_encode($sql->fetchAll(), JSON_UNESCAPED_UNICODE);
                        exit;
                        break;  
                /*
                case 'login':
                        $sql = $pdo->prepare("
                        SELECT id_usuario, password, nombre, apellidos, fecha_nacimiento, celular,  correo
                        FROM usuarios 
                        WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE correo = :correo)");
                        
                    $sql->bindValue(':correo', $_GET['correo']);
                    $sql->execute();
                    header("HTTP/1.1 200 ok");
                    $sql->setFetchMode(PDO::FETCH_ASSOC);
                    echo json_encode($sql->fetchAll(), JSON_UNESCAPED_UNICODE);
                    exit;
                    break;
                case 'registrar':
                    $correo = $_REQUEST['correo'];
                    $nombre = $_REQUEST['nombre'];
                    $apellidos = $_REQUEST['apellidos'];
                    $fecha =date( $_REQUEST['fecha']);
                    $celular = $_REQUEST['celular'];
                    $password = $_REQUEST['password'];

                    $sql = $pdo->prepare("INSERT into usuarios 
                    (nombre,apellidos,correo,
                    password,celular, fecha_nacimiento)  
                    VALUES(
                        '$nombre','$apellidos',
                        '$correo','$password',
                        '$celular','$fecha')");
                    try {
                        $sql->execute();
                        $sql->setFetchMode(PDO::FETCH_ASSOC);
                        $reg = array('registro' => 'true');
                        echo json_encode($reg);
                    } catch (PDOException $e) {
                        $reg = array('registro' => 'false');
                        echo json_encode($reg);
                        echo 'Error: ' . $e->getMessage();
                    }
                    header("HTTP/1.1 200 ok");
                    exit;
                    break;
                case 'actualizar':
                    $sql = $pdo->prepare("UPDATE usuarios SET
                        password=:password,
                        correo=:correo,
                        nombre=:nombre,
                        apellidos=:apellidos,
                        fecha_nacimiento=:fecha_nacimiento,
                        celular=:celular
                        WHERE id_usuario=:id_usuario");
                    $sql->bindValue(':id_usuario', $_GET['id_usuario']);
                    $sql->bindValue(':correo', $_GET['correo']);
                    $sql->bindValue(':password', $_GET['password']);
                    $sql->bindValue(':apellidos', $_GET['apellidos']);
                    $sql->bindValue(':nombre', $_GET['nombre']);
                    $sql->bindValue(':fecha_nacimiento', $_GET['fecha_nacimiento']);
                    $sql->bindValue(':celular', $_GET['celular']);
                    try {
                        $sql->execute();
                        $sql->setFetchMode(PDO::FETCH_ASSOC);
                        $reg = array('Actualizacion' => 'true');
                        echo json_encode($reg);
                    } catch (PDOException $e) {
                        $reg = array('Actualizacion' => 'false', 'Error' => $e->getMessage());
                        echo json_encode($reg);
                    }
                    
                    header("HTTP/1.1 200 ok");
                    exit;
                    break;
                case 'getEstablecimientos':
                    $sql = $pdo->prepare("
                        SELECT  nombre
                        FROM establecimiento");
                    $sql->execute();
                    header("HTTP/1.1 200 ok");
                    $sql->setFetchMode(PDO::FETCH_ASSOC);
                    echo json_encode($sql->fetchAll(), JSON_UNESCAPED_UNICODE);
                    exit;
                    break;
                case 'generarTurno':
                    $codigo = generaTurno();
                    $id_usuario =  $_GET['id_usuario'];
                    $nombre_e =  $_GET['nombre_e'];
                    $atendido = 0;
                    $numero = 0;
                    
                     $sql = $pdo->prepare("select id_establecimiento, numero, codigo, atendido
                        from turnos where id_usuario = :id_usuario and id_establecimiento = (SELECT id_establecimiento FROM establecimiento WHERE nombre=:nombre_e)");
                        $sql->bindValue(':id_usuario', $_GET['id_usuario']);
                        $sql->bindValue(':nombre_e', $_GET['nombre_e']);
                    try {
                        $sql->execute();
                        $sql->setFetchMode(PDO::FETCH_ASSOC);
                        $json  = json_encode($sql->fetchAll(), JSON_UNESCAPED_UNICODE);
                        
                        $sql2 = $pdo->prepare("select MAX(numero) as numero from turnos where id_establecimiento = (SELECT id_establecimiento FROM establecimiento WHERE nombre=:nombre_e)");
                        $sql2->bindValue(':nombre_e', $_GET['nombre_e']);
                        $sql2->execute();
                        $sql2->setFetchMode(PDO::FETCH_ASSOC);
                        $ultimo_turno=0;
                        
                       foreach ($sql2 as $row2){
                             $ultimo_turno=$row2["numero"];
                        }
                        
                        $numero = (int)$ultimo_turno + 1;
                        
                        if(strlen($json) == 2){
                            $sql = $pdo->prepare("INSERT INTO turnos
                            (id_usuario, id_establecimiento, numero, codigo, atendido)
                            VALUES ('$id_usuario', (SELECT id_establecimiento FROM establecimiento WHERE nombre='$nombre_e'), '$numero', '$codigo', '$atendido')");
                            $sql->execute();
                            $sql->setFetchMode(PDO::FETCH_ASSOC);
                            $reg = array('turno' => 'true', 'codigo'=> $codigo , 'numero'=> $numero);
                            echo json_encode($reg);

                        }else{
                            $reg = array('Turno' => 'false', 'error' => 'Ya hay turno registrado en este lugar');
                            echo json_encode($reg);
                        }
                    } catch (PDOException $e) {
                        $reg = array('Turno' => 'false', 'Error' => $e->getMessage());
                        echo json_encode($reg);
                    }
                    header("HTTP/1.1 200 ok");
                    exit;
                    break;    
                case 'consultaTurno':
                    //$codigo =  $_GET['codigo'];
                    $sql = $pdo->prepare("SELECT numero, id_establecimiento from turnos
                    where codigo = :codigo");
                    $sql->bindValue(':codigo', $_GET['codigo']);
                    try {
                        $sql->execute();
                        $sql->setFetchMode(PDO::FETCH_ASSOC);
                        foreach ($sql as $row){
                            $id_establecimiento=$row["id_establecimiento"];
                             $numero=$row["numero"];
                        }
                        $sql = $pdo->prepare("SELECT nombre from establecimiento
                        where id_establecimiento = '$id_establecimiento' ");
                        $sql->execute();
                        $sql->setFetchMode(PDO::FETCH_ASSOC);
                         foreach ($sql as $row){
                             $nombre=$row["nombre"];
                        }
                        $reg = array('turno' => 'true', 'numero' => $numero, 'nombre' => $nombre);
                        echo json_encode($reg);
                    } catch (PDOException $e) {
                        $reg = array('Turno' => 'false', 'Error' => $e->getMessage());
                        echo json_encode($reg);
                    }
                    header("HTTP/1.1 200 ok");
                    exit;
                    break;  */
                    
                default:
                    header("HTTP/1.1 400 Error Solicitud GET");
                    echo "ERROR 400: ERROR Solicitud GET";
                    break;
            }
        }
        break;
    case 'POST':
        if (isset($_REQUEST['Solicitud'])) {
            $Solicitud = $_REQUEST['Solicitud'];
            switch ($Solicitud) {

                default:
                    header("HTTP/1.1 400 Error Solicitud POST");
                    break;
            }
        } else {
            header("HTTP/1.1 402 Error solicitud post");
            echo "ERROR 402: Solicitud post";
        }
        break;
    default:
        header("HTTP/1.1 405 ERROR METHOD");
        echo "ERROR 405: ERROR METHOD";
        exit;
        break;
}
?>
