export default `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: monospace; font-size: 1.4rem; max-width: 700px; margin: 30px auto; padding: 20px; border: 1px solid #eee; }
  </style>
<script>
    // Function to randomly select a word from a predefined array
    function generateRandomWord() {
      const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'suchbinding'];
      return words[Math.floor(Math.random() * words.length)];
    }

    document.addEventListener('DOMContentLoaded', function() {
      const link = document.getElementById('random-link');
      link.addEventListener('click', function(event) {
        event.preventDefault(); 
        const randomWord = generateRandomWord();
        window.location.href = 'specific/' + randomWord;
      });
    });
  </script>
</head>
  <body>
    This is a Container-enabled Worker!<br><br>
    Route to <b><a href="#" id="random-link" >specific/:ID</a></b> to spin up a new container for each ID.<br><br>
    Route to <b><a href="/lb">/lb</a></b> to load balance across multiple containers.
  </body>
</html>
`;
