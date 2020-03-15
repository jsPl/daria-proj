import { useEffect, useState } from 'react';
import axios from 'axios';

const API_HOST = 'http://localhost:3004';

export const useDataApi = (initialUrl, initialData) => {
    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [totalItemsCount, setTotalItemsCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);
            try {
                const result = await axios(url);

                setData(result.data);
                setTotalItemsCount(result.headers['x-total-count'] || 0);
            }
            catch (error) {
                setIsError(true);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [url]);

    return [{ data, isLoading, isError, totalItemsCount, url }, setUrl];
}

export const handleApiQueryChange = (apiQuery, { pagination, sorter, searchText }) => {
    const url = new URL(API_HOST + apiQuery);
    const queryParams = url.searchParams;

    //console.log('handleApiQueryChange', apiQuery, url.toString())

    const handleSort = sorter => {
        if (sorter) {
            const { field, order = 'asc' } = sorter;

            if (field) {
                queryParams.set('_sort', field);
                queryParams.set('_order', order === 'ascend' ? 'asc' : 'desc');
            }
        }
    }

    const handlePagination = pagination => {
        //console.log('handlePagination', pagination);
        if (pagination) {
            queryParams.set('_page', pagination.current);
            queryParams.set('_limit', pagination.pageSize);
        }
    }

    const handleSearch = text => {
        //console.log('handleSearch', text)
        if (text !== undefined) {
            queryParams.set('q', text);
            queryParams.set('_page', 1);
        }
    }

    handleSort(sorter);
    handlePagination(pagination);
    handleSearch(searchText);

    return url.pathname + '?' + queryParams.toString();
}