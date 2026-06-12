import { useState, useEffect } from 'react';

const useFetch = (fetchFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await fetchFunction();
                setData(result);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchFunction]);

    return { data, loading, error };
};

export default useFetch;
