<?php
$field_name = $_POST['name'];
$field_email = $_POST['email'];
$field_header = $_POST['header'];
$body = $_POST['message'];

$mail_to = 'vs@dnbhub.com';
$subject = 'Message from dnbhub.com site user: '.$field_header;

//$data_charset = 'CP1251';
$data_charset = 'UTF-8';
$send_charset = 'UTF-8';

// mime-type transformation function - START
function send_mime_mail($field_name, // sender's name
												$field_email, // sender's email
												$mail_to, // recipient's email
												$data_charset, // sent data encoding
												$send_charset, // email encoding
												$subject, // email subject
												$body, // email body
												$html = false // send email in html or plain text
												) {
	$mail_to = '<' . $mail_to . '>';
	$subject = mime_header_encode($subject, $data_charset, $send_charset);
	$from =  mime_header_encode($field_name, $data_charset, $send_charset). ' <' . $field_email . '>';

	if($data_charset !== $send_charset) {
		$body = iconv($data_charset, $send_charset, $body). ' <' . $field_email . '>';
	}
	$headers .= "From: $from\r\n";
	$headers .= "Reply-To: $from\r\n";
	$headers .= "Content-type: text/plain; charset=$send_charset\r\n";
	$headers .= "Mime-Version: 1.0\r\n";

	return mail($mail_to, $subject, $body, $headers);
}

function mime_header_encode($str, $data_charset, $send_charset) {
	if($data_charset != $send_charset) {
		$str = iconv($data_charset, $send_charset, $str);
	}
	return '=?' . $send_charset . '?B?' . base64_encode($str) . '?=';
}
// mime-type transformation function - END

if ((strlen($field_name) > 3) && (strlen($field_email) >= 5) && (strlen($field_header) > 3) && (strlen($body) > 3)) {
	$mail_status = send_mime_mail($field_name, $field_email, $mail_to, $data_charset, $send_charset, $subject, $body);
}

if ($mail_status && (strlen($field_name) > 3) && (strlen($field_email) >= 5) && (strlen($field_header) > 3) && (strlen($body) > 3)) { ?>
	{"success":"Your message was successfully sent."}
<?php
}
else { ?>
	{"error":"Something went wrong, message was not sent. Most probably you did not provide enough data to send it. Try again."}
<?php
}
?>
