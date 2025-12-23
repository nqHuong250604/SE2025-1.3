import { useState, useEffect, useCallback } from "react";

const useFetchData = (fetchFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(0); // Dùng để trigger reload

    // Hàm để gọi lại API
    const reload = useCallback(() => {
        setVersion(v => v + 1);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchFunction();
                setData(result);
            } catch (err) {
                setError(err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [...dependencies, version]); 

    return { data, loading, error, reload }; 
};

export default useFetchData;
