import { exec } from 'child_process';

// runs a shell script from your server when someone makes an API request.
export const runScript = (req, res) => {
  // error running the script it logs the error and returns 500 response
  exec('./server/scripts/script.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }

    // stderr may contain warnings even if error is null, so we log but don't block success unless needed
    if (stderr && !stdout) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ stderr });
    }

    console.log(`stdout: ${stdout}`);
    res.status(200).json({ output: stdout });
  });
};
