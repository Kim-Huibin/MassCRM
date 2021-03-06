import React from 'react';
import { TableCellBaseProps } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getFilterSettings, getIndustries } from 'src/selectors';
import { getAddContactList, updateCompany } from 'src/actions';
import {
  findIndustryIDByName,
  joinNamesOfIndusrty,
  getNamesOfIndustry
} from 'src/utils/map';
import { EditPopup } from '..';
import { IIndusrtyCell } from './interfaces';
import { ItemsEdit } from './ItemsEdit';

export const industryCell = ({ id, value, ...props }: IIndusrtyCell) => (
  tdProps: React.PropsWithChildren<TableCellBaseProps>
) => {
  const dispatch = useDispatch();
  const filter = useSelector(getFilterSettings);
  const industryList = useSelector(getIndustries);

  const items = getNamesOfIndustry(industryList);
  const values = getNamesOfIndustry(value);

  const ContentTD = () => <div>{joinNamesOfIndusrty(value)}</div>;

  const sendData = async (newData: Array<string>) => {
    const industries = findIndustryIDByName(newData, industryList) || value;

    await updateCompany(id, { industries });
    dispatch(getAddContactList(filter));
  };

  return (
    <EditPopup
      tdProps={tdProps}
      editProps={{ value: values, items, sendData, multi: true, ...props }}
      ContentTD={ContentTD}
      ContentEdit={ItemsEdit}
      disabled={!id}
    />
  );
};
