import clsx from 'clsx'; 
import { Loader2 } from 'lucide-react';


export default function Loader({ 
    className, 
    size 
} : { 
    className?: string,
    size?: number 
}){
    return (
        <Loader2 className={clsx('animate-spin', className)} size={size} />
        
    )
}


