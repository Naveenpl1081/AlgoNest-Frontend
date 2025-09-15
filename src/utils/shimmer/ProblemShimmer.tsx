import { CodeEditorSkeleton } from "./CompailerSkeleton";
import { ProblemSkeleton } from "./ProblemSkelaton";

const ShimmerSkeleton: React.FC = () => {
    return (
      <div className="flex h-full">
        <div className="w-1/2 border-r border-gray-700">
          <ProblemSkeleton />
        </div>
        <div className="w-1/2">
          <CodeEditorSkeleton />
        </div>
      </div>
    );
  };
  
  export default ShimmerSkeleton;