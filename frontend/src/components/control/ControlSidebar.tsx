
import ControlFilters from "../ControlFilters";
import { DocumentData } from "@/hooks/useDocuments";

interface ControlSidebarProps {
  onFiltersChange: (filtered: DocumentData[]) => void;
  documentsData: DocumentData[];
}

const ControlSidebar = ({ onFiltersChange, documentsData }: ControlSidebarProps) => {
  return (
    <div className="xl:col-span-1 order-2 xl:order-1">
      <div className="xl:sticky xl:top-24">
        <ControlFilters 
          onFiltersChange={onFiltersChange}
          documentsData={documentsData}
        />
      </div>
    </div>
  );
};

export default ControlSidebar;
