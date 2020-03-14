import { useEffect, useState } from 'react';
import axios from 'axios';

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

    return [{ data, isLoading, isError, totalItemsCount }, setUrl];
}

// const createPaginationData = (url, headers = {}) => {
//     const urlParams = new URLSearchParams(url);
//     //console.log(urlParams, headers)

//     return {
//         current: urlParams.get('_page') || 1,
//         pageSize: urlParams.get('_limit') || 0,
//         totalItems: headers['x-total-count'] || 0
//     }
// }