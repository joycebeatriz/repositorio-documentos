
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const FilterInput = ({ label, value, onChange, placeholder }: FilterInputProps) => {
  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
};

export default FilterInput;
