
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "../SearchBar";
import ControlTable from "../ControlTable";
import StatsCards from "../panel/StatsCards";
import { DocumentData } from "@/types/document";

interface ControlContentProps {
  search: string;
  setSearch: (search: string) => void;
  filteredDocuments: DocumentData[];
  onRealTimeSearch?: (search: string) => void;
}

const ControlContent = ({ 
  search, 
  setSearch, 
  filteredDocuments, 
  onRealTimeSearch
}: ControlContentProps) => {
  return (
    <div className="xl:col-span-3 order-1 xl:order-2">
      <div className="space-y-4 sm:space-y-6">
        {/* Estatísticas */}
        <StatsCards filteredDocuments={filteredDocuments} />
        
        {/* Search Bar */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <SearchBar 
              search={search} 
              setSearch={setSearch} 
              onRealTimeSearch={onRealTimeSearch}
            />
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
          <CardContent className="p-0">
            <ControlTable documentsData={filteredDocuments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ControlContent;
