import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchBox = ({ onSearch }) => {

    const handleSearch = value => {
        onSearch(value);
    }

    return <Search 
        className='searchBox'
        placeholder='Type search text' size='large' autoFocus allowClear onSearch={handleSearch} enterButton />
}

export default SearchBox;