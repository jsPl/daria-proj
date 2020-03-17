import React from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Table, Tag, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';
import { useDataApi, handleApiQueryChange } from '../modules/api';
import { formatCurrency, formatDateTime, truncateString } from '../modules/utils';
import SearchBox from './SearchBox';

const { Column } = Table;
const DEFAULT_PAGE_SIZE = 10;
const API_ENDPOINT = '/requests';

function RequestList() {
    const { page = 1, sortBy = 'Id', sortOrder = 'asc' } = useParams();
    const history = useHistory();

    const initialApiQuery = `${API_ENDPOINT}?_page=${page}&_limit=${DEFAULT_PAGE_SIZE}&_sort=${sortBy}&_order=${sortOrder}`;
    const [{ data, isLoading, totalItemsCount, url }, doFetch] = useDataApi(initialApiQuery, []);

    const paginationCfg = configurePagination(page, totalItemsCount);

    const handleChange = payload => {
        //console.log('handleChange', payload)
        doFetch(handleApiQueryChange(url, payload))
    }

    return (
        <>
            <SearchBox onSearch={searchText => { handleChange({ searchText }); history.push('/dashboard/1') }} />

            <Table dataSource={data} rowKey='Id' loading={isLoading} pagination={paginationCfg}
                onChange={(pagination, filters, sorter) => handleChange({ pagination, filters, sorter })}>
                <Column title='Id' dataIndex='Id' sorter defaultSortOrder='ascend' />
                <Column title='Request Name' dataIndex='RequestName' sorter />
                <Column title='Requestor' dataIndex='Requestor' />
                <Column title='Good Ending' dataIndex='GoodEnding' />
                <Column title='Description' dataIndex='Description' width={500} render={value => textToTooltip(value)} />
                <Column title='Need Story Teller' dataIndex='NeedStoryteller' render={value => value ? <CheckOutlined /> : null} />
                <Column title='Status' dataIndex='Status' sorter />
                <Column title='Budget' dataIndex='Budget' sorter render={value => formatCurrency(value)} />
                <Column title='Wanted Characters' dataIndex='WantedCharacters' render={value => wantedCharactersToTags(value)} />
                <Column title='Deadline' dataIndex='Deadline' sorter render={value => formatDateTime(new Date(value))} />
            </Table>
        </>
    )
}

const configurePagination = (currentPage, totalItems = 0) => {
    return {
        current: Number(currentPage),
        total: Number(totalItems),
        pageSize: DEFAULT_PAGE_SIZE,
        position: 'both',
        itemRender(page, type) {
            if (type === 'prev') {
                return <Link to={`/dashboard/${page}`}><LeftOutlined /></Link>;
            }
            if (type === 'next') {
                return <Link to={`/dashboard/${page}`}><RightOutlined /></Link>;
            }
            return <Link to={`/dashboard/${page}`}>{page}</Link>;
        }
    }
}

const wantedCharactersToTags = value =>
    value.split(';')
        .map(o => o.trim() !== '' && <Tag key={o}>{o}</Tag>)

const textToTooltip = value => {
    const maxLength = 50;
    if (value && value.length > maxLength) {
        return (
            <Tooltip title={truncateString(value, 500)}>
                {truncateString(value, maxLength)}
            </Tooltip>
        )
    }
    return value;
}

export default RequestList;