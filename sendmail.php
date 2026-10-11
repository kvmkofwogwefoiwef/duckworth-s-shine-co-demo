<?php
// send-mail.php - Hostinger SMTP Contact Form Handler
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Your email credentials (create this mailbox in Hostinger hPanel first)
$smtpHost = 'smtp.hostinger.com';
$smtpPort = 587; // Use 465 for SSL
$smtpUser = 'detail@duckworthsshine.com'; // CHANGE THIS
$smtpPass = 'your-email-password';          // CHANGE THIS
$notifyEmail = 'detail@duckworthsshine.com'; // Where you receive notifications

// Collect and sanitize form data
$name    = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$vehicle = htmlspecialchars(trim($_POST['vehicle'] ?? ''), ENT_QUOTES, 'UTF-8');
$location = htmlspecialchars(trim($_POST['location'] ?? ''), ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars(trim($_POST['service'] ?? ''), ENT_QUOTES, 'UTF-8');
$date    = htmlspecialchars(trim($_POST['preferred_date'] ?? ''), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
$quote   = htmlspecialchars(trim($_POST['quote_estimate'] ?? ''), ENT_QUOTES, 'UTF-8');

// Basic validation
if (empty($name) || empty($phone) || empty($email)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Name, phone, and email are required.']);
    exit;
}

// Build the email body
$emailBody = "New Booking Request\n\n";
$emailBody .= "Name: $name\n";
$emailBody .= "Phone: $phone\n";
$emailBody .= "Email: $email\n";
$emailBody .= "Vehicle/Boat: $vehicle\n";
$emailBody .= "Location: $location\n";
$emailBody .= "Service: $service\n";
$emailBody .= "Preferred Date: $date\n";
$emailBody .= "Message: $message\n\n";
$emailBody .= "Quote Estimate: $quote\n";

// Use PHP's mail() with proper headers (simplest method)
// Note: For better deliverability, PHPMailer is recommended but requires installation.
$headers  = "From: DuckWorth's Shine Co. <$smtpUser>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$subject = "New Booking — $vehicle — $service";

// Send the email
if (mail($notifyEmail, $subject, $emailBody, $headers)) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail delivery failed']);
}
?>