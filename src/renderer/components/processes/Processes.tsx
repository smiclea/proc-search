import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  TableContainer, Table, TableBody, TableRow, TableCell,
  Button, Paper, makeStyles, Theme, createStyles, TableHead, TableSortLabel,
} from '@material-ui/core'
import useStores from '../../stores/useStores'
import ProcessesFilter from './ProcessesFilter'
import { Process } from '../../../@types/Process'

const useStyles = makeStyles((theme: Theme) => createStyles({
  margin: {
    margin: theme.spacing(1),
  },
  headerCell: {
    fontWeight: 600,
  },
}))

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
`

const Processes = () => {
  const classes = useStyles()
  const { processStore } = useStores()
  const [disabledButtons, setDisabledButtons] = useState<number[]>([])

  useEffect(() => {
    processStore.load()
  }, [])

  const handleProcessKill = async (process: Process, killByName: boolean) => {
    setDisabledButtons([...disabledButtons, process.pid])
    setTimeout(() => {
      setDisabledButtons(disabledButtons.filter(d => d !== process.pid))
    }, 1000)
    await processStore.killProcess(process, killByName)
  }

  const renderSortLabel = (label: string, key: keyof Process) => (
    <TableSortLabel
      active={key === processStore.sortBy}
      direction={processStore.sortDir}
      onClick={() => {
        processStore.setSort(key, processStore.sortBy === key ? processStore.sortDir === 'asc' ? 'desc' : 'asc' : processStore.sortDir)
      }}
    >
      {label}
    </TableSortLabel>
  )

  return (
    <Wrapper>
      <ProcessesFilter
        searchValue={processStore.filterValue}
        onSearchValueChange={v => { processStore.setFilterValue(v) }}
        groupByName={processStore.groupByName}
        onGroupByNameChange={v => { processStore.setGroupByName(v) }}
        onReloadClick={() => { processStore.load() }}
      />
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>
                {renderSortLabel('Image Name', 'imageName')}
              </TableCell>
              <TableCell className={classes.headerCell} align="right">
                {renderSortLabel('PID', 'pid')}
              </TableCell>
              <TableCell className={classes.headerCell} align="right">
                {renderSortLabel('Session Name', 'sessionName')}
              </TableCell>
              <TableCell className={classes.headerCell} align="right">
                {renderSortLabel('Session Number', 'sessionNumber')}
              </TableCell>
              <TableCell className={classes.headerCell} align="right">
                {renderSortLabel('Mem Usage', 'memUsage')}
              </TableCell>
              <TableCell className={classes.headerCell} align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {processStore.filteredProcesses.map(process => {
              const isMultiple = process.sessionName === '[multiple]'
              return (
                <TableRow key={process.pid}>
                  <TableCell>{process.imageName}</TableCell>
                  <TableCell align="right">{isMultiple ? '[multiple]' : process.pid}</TableCell>
                  <TableCell align="right">{isMultiple ? '-' : process.sessionName}</TableCell>
                  <TableCell align="right">{isMultiple ? '-' : process.sessionNumber}</TableCell>
                  <TableCell align="right">{(process.memUsage / 1024).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} MB</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      className={classes.margin}
                      onClick={() => { handleProcessKill(process, isMultiple) }}
                      color="secondary"
                      disabled={disabledButtons.indexOf(process.pid) > -1}
                    >
                      Kill
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Wrapper>
  )
}

export default observer(Processes)
