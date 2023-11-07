<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirectionare</title>
</head>
<body>
    <form method="POST" action="{{ route("payment.ipn.process") }}">
        @csrf

        <input type="hidden" name="env_key" value="{{ $env_key }}">
        <input type="hidden" name="data" value="{{ $data }}">
        <input type="hidden" name="cipher" value="{{ $cipher }}">
        <input type="hidden" name="iv" value="{{ $iv }}">
        <button type="submit">submit</button>
    </form> 
</body>
</html>