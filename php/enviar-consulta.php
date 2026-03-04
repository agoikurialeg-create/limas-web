<?php
header('Content-Type: application/json; charset=utf-8');

function fail($msg, $code = 400) {
  http_response_code($code);
  echo json_encode(["ok" => false, "error" => $msg]);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  fail("Método no permitido.", 405);
}

// Honeypot anti-spam (si viene relleno => bot)
if (!empty($_POST["empresa"])) {
  fail("Solicitud rechazada.", 400);
}

// Recoge y limpia
$nombre   = trim($_POST["nombre"] ?? "");
$telefono = trim($_POST["telefono"] ?? "");
$email    = trim($_POST["email"] ?? "");
$mensaje  = trim($_POST["mensaje"] ?? "");

// Validaciones servidor (imprescindible)
if (mb_strlen($nombre) < 2 || mb_strlen($nombre) > 60) fail("Nombre inválido.");
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 120) fail("Email inválido.");
if (mb_strlen($mensaje) < 10 || mb_strlen($mensaje) > 800) fail("Mensaje inválido.");

if ($telefono !== "" && !preg_match('/^[0-9+\-\s()]{7,20}$/', $telefono)) {
  fail("Teléfono inválido.");
}

// Anti header injection
if (preg_match("/[\r\n]/", $email)) fail("Email inválido.");

// Config
$to = "limasbarakaldo@yahoo.es";
$subject = "Nueva consulta desde la web LIMAS";

// Cuerpo
$body =
"Has recibido una nueva consulta desde la web:\n\n" .
"Nombre: $nombre\n" .
"Teléfono: " . ($telefono ?: "-") . "\n" .
"Email: $email\n\n" .
"Mensaje:\n$mensaje\n\n" .
"---\nEnviado desde el formulario de la web.\n";

// Cabeceras (mejor: From fijo del dominio + Reply-To del cliente)
$from = "no-reply@limas.es"; // cámbialo al dominio real cuando esté publicado
$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "From: LIMAS Web <{$from}>";
$headers[] = "Reply-To: {$email}";
$headersStr = implode("\r\n", $headers);

// Envío
$sent = @mail($to, $subject, $body, $headersStr);

if (!$sent) {
  fail("No se pudo enviar el correo desde el servidor. Configura el envío (SMTP).", 500);
}

echo json_encode(["ok" => true]);