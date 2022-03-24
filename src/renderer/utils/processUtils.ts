import { execFile, exec } from 'child_process'
import csv from 'csv'
import { promisify } from 'util'

import { Process } from '../../@types/Process'

const execFilePromise = promisify(execFile)
const execPromise = promisify(exec)
const parseCsv = promisify(csv.parse)

export default {
  getProcessList: async (): Promise<Process[]> => {
    const { stdout } = await execFilePromise('tasklist.exe', ['/nh', '/fo', 'csv'])
    const records = await parseCsv(stdout, {
      columns: [
        'imageName',
        'pid',
        'sessionName',
        'sessionNumber',
        'memUsage',
      ],
    })
    const processes: Process[] = records.map((record: any) => ({
      imageName: record.imageName,
      pid: Number(record.pid),
      sessionName: record.sessionName,
      sessionNumber: Number(record.sessionNumber),
      memUsage: Number(record.memUsage.replace(/[^\d]/g, '')),
    }))
    return processes
  },

  killProcessByName: async (name: string): Promise<string> => (await execPromise(`taskkill /IM "${name}" /F`)).stdout,

  killProcessById: async (pid: number): Promise<string> => (await execPromise(`taskkill /F /PID ${pid}`)).stdout,
}
