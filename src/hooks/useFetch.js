import { useState, useEffect } from 'react';

export function useFetch(url, onSuccess) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const result = await response.json();
                if (onSuccess) onSuccess(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url, onSuccess]);

    return { loading, error };
}
