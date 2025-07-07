// runs a shell script from your server when someone makes an API request.

exports.runScript = (req, res) => {
  // error running the script it logs the error and returns 500 reponse
  exec('./server/scripts/script.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: error.message });
    }
    // if there is stderr the it response 500 
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ stderr });
    }
    console.log(`stdout: ${stdout}`);
    res.json({ output: stdout });
  });
};