export default `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: monospace; font-size: 1.4rem; max-width: 700px; margin: 30px auto; padding: 20px; border: 1px solid #eee; }
  </style>
</head>
  <body>
    This is a Container-enabled Worker!<br><br>
    Route to <b><a href="/id/1">/id/<ID></a></b> to make a container
    Route to <b><a href="/status/1">/status/<ID></a></b> to check if its running
    Route to <b><a href="/destroy/1">/destroy/<ID></a></b> to destroy it
    Route to <b><a href="/signal/1/1">/signal/<ID>/<SIGNAL_INT></a></b> to sent a signal
  </body>
</html>
`;
