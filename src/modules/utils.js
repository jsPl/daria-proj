const locale = 'en-US'; // pl-PL

export const formatCurrency = (value, currency = 'FAB') => {
    return value.toLocaleString(locale, {
        style: 'currency',
        currency
    });
}

export const formatDateTime = (date = new Date()) => {
    const dateAsString = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    const timeAsString = date.toLocaleTimeString(locale);
    return dateAsString + ' ' + timeAsString;
}

export const truncateString = (value, max = 50) => {
    if (value && value.length > max) {
        return value.substr(0, max - 1) + '...'
    }
    return value;
}