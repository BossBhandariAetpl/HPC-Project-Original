import asyncHandler from 'express-async-handler';
import mysqldb from '../config/mysqldb.js';



// Get All Jobs 

export const getAllJobs = asyncHandler(async (req, res) => {
    try {
      // const [jobs] = await mysqldb.query('SELECT job_db_inx, cpus_req,id_job,job_name,nodelist,nodes_alloc,state,work_dir,submit_line  FROM cluster_job_table');
         const [jobs] = await mysqldb.query('SELECT * FROM cluster_job_table');
      res.status(200).json(jobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });