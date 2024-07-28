const Loader = () => {
  return (
    <div>
      loading...
    </div>
  )
}
export default Loader

interface SkeletonProps {
  width?: string;
  length?: number;
}


export const Skeleton = ({ width = "unset", length = 3 }:
  SkeletonProps) => {
  
  const skeletions = Array.from({ length }, (_,index) => 
  <div key={index} className="skeleton-shape"></div>);
  
  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletions}
    </div>
  )
}