import {LoaderIcon} from 'lucide-react'
const PageLoader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
        <LoaderIcon className="size-10 animate-spin"/>
    </div>
  );
};

export default PageLoader;