'use client';
import { usePathname } from "next/navigation";

export default function YourPageName() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const pageName = pathSegments[pathSegments.length - 1] || 'home'; 
    
    return (
        <div>
            <h1>Hello from your new page!</h1>
            <p>This is the content of the page: {pageName}</p>
        </div>
    );
}