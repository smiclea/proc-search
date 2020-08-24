import { observable, action, runInAction } from 'mobx'
import processUtils from '../utils/processUtils'
import { Process } from '../../@types/Process'
import notificationStore from './NotificationStore'
import { SeverityLevel } from '../../@types/Notification'

class ProcessStore {
  private allProcesses: Process[] = []

  @observable
  filteredProcesses: Process[] = []

  @observable
  filterValue: string = ''

  @observable
  sortBy: keyof Process = 'imageName'

  @observable
  sortDir: 'asc' | 'desc' = 'asc'

  @observable
  groupByName: boolean = true

  @action
  async load() {
    const processes = await processUtils.getProcessList()
    runInAction(() => {
      this.allProcesses = processes
      this.filter()
    })
  }

  @action
  private filter() {
    const groupedProcesses: Process[] = []

    this.allProcesses.forEach(process => {
      if (this.groupByName) {
        const prevProcess = groupedProcesses.find(p => p.imageName === process.imageName)
        if (prevProcess) {
          prevProcess.sessionName = '[multiple]'
          prevProcess.memUsage += process.memUsage
          return
        }
      }
      groupedProcesses.push({ ...process })
    })

    this.filteredProcesses = groupedProcesses
      .filter(p => p.imageName.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1)
      .slice().sort((a, b) => {
        const firstItem = this.sortDir === 'asc' ? a : b
        const secondItem = this.sortDir === 'asc' ? b : a
        switch (this.sortBy) {
          case 'imageName':
          case 'sessionName':
            return firstItem[this.sortBy].localeCompare(secondItem[this.sortBy])
          default:
            return firstItem[this.sortBy] - secondItem[this.sortBy]
        }
      })
      .filter((_, i) => i < 20)
  }

  @action
  setFilterValue(value: string) {
    this.filterValue = value
    this.filter()
  }

  @action
  setGroupByName(value: boolean) {
    this.groupByName = value
    this.filter()
  }

  async killProcess(process: Process, killByName: boolean) {
    setTimeout(() => {
      this.load()
    }, 1000)
    try {
      let result: string
      if (killByName) {
        result = await processUtils.killProcessByName(process.imageName)
      } else {
        result = await processUtils.killProcessById(process.pid)
      }
      notificationStore.show(SeverityLevel.SUCCESS, result)
      this.load()
    } catch (err) {
      notificationStore.show(SeverityLevel.ERROR, err.message)
    }
  }

  @action
  setSort(by: keyof Process, direction: 'asc' | 'desc') {
    this.sortBy = by
    this.sortDir = direction
    this.filter()
  }
}

export default new ProcessStore()
