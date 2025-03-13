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
    Route to <b>/specific/:ID</b> to spin up a new container for each ID.<br><br>
    Route to <b>/lb</b> to load balance across multiple containers.
  </body>
</html>
`;
