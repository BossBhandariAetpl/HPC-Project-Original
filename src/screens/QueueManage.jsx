import { queuemanagedata } from "@/data/queuemanagedata"
import {queueManageColumns} from "@/components/queuemanager-columns"
import { DataTable } from "@/components/queueManage-data-table"

const QueueManage = () => {
  
  return (
    <div className="container mx-auto ">
      <DataTable columns={queueManageColumns} data={queuemanagedata} />
    </div>
  )
}

export default QueueManage