<script>

</script>

<template>
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="layout-centered">
    <section class="auth-container">
        <h2>Login</h2>
        <form id="loginform">
            <label class="form-label">Mail</label>
            <input type="email" placeholder="..." id="email" class="form-control" required autofocus>
            <label class="form-label">Contraseña</label>
            <input type="password" placeholder="..." id="password" class="form-control" required>
            <input type="submit" value="Ingresar" class="btn btn-primary">
        </form>
        <p>¿No tienes una cuenta? <a href="signup.html">Regístrate</a></p>
    </section>
    <script src="js/login.js"></script>
</body>
</html>
</template>