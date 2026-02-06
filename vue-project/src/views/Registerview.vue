<script>

</script>

<template>
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/styles.css">
    <title>Registro</title>
</head>
<body class="layout-centered">
    <section class="auth-container">
        <h2>Registro</h2>
        <form id="signupForm">
            <label class="form-label">Nombre</label>
            <input type="text" placeholder="..." id="name" class="form-control" required>
            <label class="form-label">Mail</label>
            <input type="email" placeholder="..." id="email" class="form-control" required>
            <label class="form-label">Contraseña</label>
            <input type="password" placeholder="..." id="password" class="form-control" required>
            <input type="submit" value="Registro" class="btn btn-primary">
        </form>
        <p>¿Ya tienes una cuenta? <a href="login.html">Login</a></p>
    </section>
    <script src="js/signup.js"></script>
</body>
</html>
</template>