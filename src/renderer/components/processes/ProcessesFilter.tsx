import React from 'react'
import styled from 'styled-components'
import {
  TextField, Checkbox, FormControlLabel, IconButton,
} from '@material-ui/core'
import { Replay } from '@material-ui/icons'

const Wrapper = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  margin-left: -16px;

  > * {
    margin-left: 16px;
  }
`
type Props = {
  searchValue: string,
  onSearchValueChange: (value: string) => void,
  groupByName: boolean,
  onGroupByNameChange: (value: boolean) => void,
  onReloadClick: () => void,
}

const ProcessesFilter = ({
  searchValue,
  onSearchValueChange,
  groupByName,
  onGroupByNameChange,
  onReloadClick,
}: Props) => (
  <Wrapper>
    <TextField
      label="Search"
      style={{ width: '300px' }}
      value={searchValue}
      onChange={e => { onSearchValueChange(e.currentTarget.value) }}
    />
    <IconButton color="primary" onClick={onReloadClick}>
      <Replay />
    </IconButton>
    <FormControlLabel
      control={(
        <Checkbox
          checked={groupByName}
          onChange={e => { onGroupByNameChange(e.target.checked) }}
          color="primary"
        />
        )}
      label="Group by Process Name"
    />
  </Wrapper>
)

export default ProcessesFilter
