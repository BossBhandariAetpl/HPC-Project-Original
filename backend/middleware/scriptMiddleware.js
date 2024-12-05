
exports.runScript = (req, res) => {
  exec('./server/scripts/script.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ stderr });
    }
    console.log(`stdout: ${stdout}`);
    res.json({ output: stdout });
  });
};