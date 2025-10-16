import { Settings } from "lucide-react";

const ControlHeader = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 border-b border-gray-200/50">
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 py-6 sm:py-8 lg:py-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl shadow-lg">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Controle de documentos
          </h1>
          
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            Controle completo sobre aprovações, status e organização dos documentos institucionais
          </p>
        </div>
      </div>
    </div>
  );
};

export default ControlHeader;
