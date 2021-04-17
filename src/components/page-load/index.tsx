import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function PageLoad() {
    NProgress.start();
    useEffect(() => {
        return () => {
            NProgress.done();
        }
    }, []);
    return null;
}