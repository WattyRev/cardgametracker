<?php
echo $_POST . "\n";
var_dump($_POST);

$from = $_POST['from'];
echo $from . "\n";

$to = $_POST['to'];
echo $to . "\n";

$message = $_POST['message'];
echo $message . "\n";

$subject = $_POST['subject'];
echo $subject . "\n";

$message = '
<html>
	<head>
		<title>' . $subject . '</title>
	</head>
	<body>
		' . $extra_data_string . '
		<p>' . $message . '</p>
	</body>
</html>
';

echo $message;

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From: ' . $from . "\r\n";

mail ($to, $subject, $message, $headers);