
import { useState, useEffect } from 'react'

export default function useFetch<T>(url:string): [T | null, boolean] {

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        let ignore = false;
        ( async () => {
            const response = await fetch(url);
            const result: T = await response.json();

            if (!ignore) {
                setData(result);
                setLoading(false);
            }
        })();
        return () => { ignore = true; };
        
    }, [url]);

    return [data, loading];
}