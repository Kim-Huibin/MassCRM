import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { TableContainer, TableBody, Table, Paper } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from 'src/actions';
import { getCurrentPage, getLoader } from 'src/selectors';
import history from 'src/store/history';
import { TableHeader, TableRowItem } from './components';
import { ITableConfig, ITableProps, ITableRow } from './interfaces';
import { tableStyle } from './Table.style';
import { Loader } from '../Loader';

export const TableBase: FC<ITableProps> = ({
  sorting,
  changeInput,
  count,
  resetFilter,
  autocompleteValues,
  filtersValues,
  changeFilter,
  config,
  data,
  onDeleteData,
  onEdit,
  clearAutocompleteList,
  otherHeight
}) => {
  const dispatch = useDispatch();
  const load = useSelector(getLoader);
  const style = tableStyle({ otherHeight });

  const [dataPage, setDataPage] = useState<Array<ITableRow>>(data);
  const [selectedRows, setSelectedRows] = useState<Array<number>>([]);
  const [filteredBy, setFilteredBy] = useState<Array<string>>([]);
  const currentPage = useSelector(getCurrentPage);

  const onDeleteSelected = (id?: number) =>
    onDeleteData && (id ? onDeleteData([id]) : onDeleteData(selectedRows));

  const onSelectRow = (item: number) => {
    return setSelectedRows(state =>
      state.includes(item) ? state.filter(id => id !== item) : [...state, item]
    );
  };

  const onSelectAll = () => {
    setSelectedRows(
      selectedRows.length > 0 ? [] : dataPage.map(item => item.id)
    );
  };

  const onFilteredBy = () => {
    return setFilteredBy(state => state.filter(id => !filteredBy.includes(id)));
  };

  const onChangePage = (event: ChangeEvent<unknown>, page: number) => {
    history.push({
      pathname: history.location.pathname,
      search: `?page=${page}`
    });
    dispatch(setPage(page));
  };

  const tableConfig: ITableConfig = {
    ...config,
    column: {
      ...config.column,
      onSelectAll,
      onDeleteSelected,
      onSelectRow,
      onFilteredBy,
      onEdit
    },
    body: {
      selectedRows,
      filteredBy
    }
  };

  useEffect(() => {
    setDataPage(data);
    setSelectedRows([]);
  }, [currentPage, data]);

  return (
    <>
      <TableContainer
        component={Paper}
        classes={{ root: `${style.customTable} ${style.tableHeight}` }}
      >
        <Table stickyHeader aria-label='sticky table'>
          <TableHeader
            sorting={sorting}
            changeInput={changeInput}
            resetFilter={resetFilter}
            autocompleteValues={autocompleteValues}
            filtersValues={filtersValues}
            changeFilter={changeFilter}
            config={tableConfig}
            clearAutocompleteList={clearAutocompleteList}
          />
          <TableBody
            classes={{ root: `${style.customBody} ${load && style.tableBlur}` }}
          >
            {dataPage &&
              dataPage.map(item => (
                <TableRowItem
                  config={tableConfig.column}
                  row={item}
                  key={item.id}
                  data={tableConfig.body}
                  currentPage={currentPage}
                />
              ))}
            {load && <Loader />}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        classes={{ root: style.pagination }}
        count={count}
        page={currentPage}
        onChange={onChangePage}
      />
    </>
  );
};
