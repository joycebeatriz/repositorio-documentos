import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface FilterSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: string[];
}

const FilterSelect = ({ label, value, onValueChange, placeholder, options }: FilterSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm font-normal text-left px-3 py-2"
          >
            {value && value !== "Todos"
              ? options.find((option) => option.toLowerCase() === value.toLowerCase())
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Nenhum {label.toLowerCase()} encontrado.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      const newValue = currentValue === value.toLowerCase() && value !== "Todos" ? "" : option; // Mantém o valor original da opção
                      onValueChange(newValue);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.toLowerCase() === option.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterSelect;
