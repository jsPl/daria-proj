import React, { useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Table, Tag } from 'antd';
import { LeftOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';
import { useDataApi } from '../modules/api';
import { formatCurrency, formatDateTime } from '../modules/utils';
import SearchBox from './SearchBox';

const { Column } = Table;
const DEFAULT_PAGE_SIZE = 5;
const API_ENDPOINT = '/requests';

function RequestList() {
    const { page = 1, sortBy = 'Id', sortOrder = 'asc' } = useParams();
    const history = useHistory();

    //const apiEndpointSearchParams = new URLSearchParams(`_page=${page}&_limit=${DEFAULT_PAGE_SIZE}&_sort=${sortBy}&_order=${sortOrder}`);

    const [apiEndpointSearchParams, setApiEndpointSearchParams] = useState(new URLSearchParams(`_page=${page}&_limit=${DEFAULT_PAGE_SIZE}&_sort=${sortBy}&_order=${sortOrder}`));
    const [{ data, isLoading, totalItemsCount }, doFetch] = useDataApi(`${API_ENDPOINT}?${apiEndpointSearchParams.toString()}`, []);
    const paginationCfg = configurePagination(page, totalItemsCount);

    const handleChange = (pagination, filters, sorter) => {
        handleSort(sorter, apiEndpointSearchParams);
        handlePagination(pagination, apiEndpointSearchParams);

        doFetch(`${API_ENDPOINT}?${apiEndpointSearchParams.toString()}`);
    }

    return (
        <>
            <SearchBox onSearch={value => handleSearch(value, apiEndpointSearchParams, history)} />

            <Table dataSource={data} rowKey='Id' loading={isLoading} pagination={paginationCfg} onChange={handleChange}>
                <Column title='Id' dataIndex='Id' sorter defaultSortOrder='ascend' />
                <Column title='Request Name' dataIndex='RequestName' sorter />
                <Column title='Requestor' dataIndex='Requestor' />
                <Column title='Good Ending' dataIndex='GoodEnding' />
                <Column title='Description' dataIndex='Description' width={500} />
                <Column title='Need Story Teller' dataIndex='NeedStoryteller' render={value => value ? <CheckOutlined /> : null} />
                <Column title='Status' dataIndex='Status' sorter />
                <Column title='Budget' dataIndex='Budget' sorter render={value => formatCurrency(value)} />
                <Column title='Wanted Characters' dataIndex='WantedCharacters' render={value => wantedCharactersToTags(value)} />
                <Column title='Deadline' dataIndex='Deadline' sorter render={value => formatDateTime(new Date(value))} />
            </Table>
        </>
    )
}

const handleSearch = (text, urlSearchParams, history) => {
    console.log('handleSearch', text)

    if (text && text.trim() !== '') {
        urlSearchParams.set('q', text);
        urlSearchParams.set('_page', 1);
        history.push('/dashboard/1');
    }
    //doFetch(`${API_ENDPOINT}?${urlSearchParams.toString()}`);
}

const handleSort = (sorter, urlSearchParams) => {
    if (sorter) {
        const { field, order = 'asc' } = sorter;
        //console.log('handleChange', sorter, field, order);

        if (field) {
            urlSearchParams.set('_sort', field);
            urlSearchParams.set('_order', order === 'ascend' ? 'asc' : 'desc');
            //doFetch(`${API_ENDPOINT}?${urlSearchParams.toString()}`);
        }
    }
}

const handlePagination = (pagination, urlSearchParams) => {
    //console.log('handlePagination', pagination);
    if (pagination) {
        urlSearchParams.set('_page', pagination.current);
        urlSearchParams.set('_limit', pagination.pageSize);
        //doFetch(`${API_ENDPOINT}?${urlSearchParams.toString()}`);
    }
}

const configurePagination = (currentPage, totalItems = 0) => {
    // if (Number(totalItems) === 0) {
    //     return false;
    // }

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

export default RequestList;