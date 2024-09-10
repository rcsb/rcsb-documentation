import { useState, useEffect, useCallback } from 'react';

export function useFetch(url, onSuccess) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(`Fetching data from: ${url}`);
                const response = await fetch(url);
                const result = await response.json();
                console.log("Fetched data:", result); // Log the fetched data
                if (onSuccess) onSuccess(result);
            } catch (error) {
                console.error("Fetch error:", error); // Log any fetch errors
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url]);  // Only re-run if the URL changes

    return { loading, error };
}
