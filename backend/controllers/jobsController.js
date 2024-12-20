import asyncHandler from 'express-async-handler';
import mysqldb from '../config/mysqldb.js';



// Get All Jobs 

export const getAllJobs = asyncHandler(async (req, res) => {
    try {
      const [jobs] = await mysqldb.query('SELECT * FROM cluster_job_table');
      res.status(200).json(jobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });