import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SweetFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const SweetFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: SweetFiltersProps) => {
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-low", label: "Price: Low → High" },
    { value: "price-high", label: "Price: High → Low" },
    { value: "rating", label: "Rating" },
  ];

  return (
    <div className="space-y-6 p-5 rounded-xl bg-gray-900/70 border border-gray-800 backdrop-blur-sm shadow-md">
      <Accordion type="multiple" defaultValue={["categories"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="font-semibold text-base text-gray-200">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={`rounded-full px-4 py-1 text-xs ${
                    selectedCategory === category
                      ? "bg-pink-600 text-white shadow"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort-by">
          <AccordionTrigger className="font-semibold text-base text-gray-200">
            Sort By
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 pt-3">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onSortChange(option.value)}
                  className={`rounded-md px-3 text-xs ${
                    sortBy === option.value
                      ? "bg-pink-600 text-white shadow"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Active Filters */}
      {(selectedCategory !== "All" || sortBy !== "name") && (
        <div>
          <h3 className="font-semibold text-sm text-gray-300 mb-2">
            Active Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "All" && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-full px-3 py-1 text-xs bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white transition"
                onClick={() => onCategoryChange("All")}
              >
                Category: {selectedCategory} ×
              </Badge>
            )}
            {sortBy !== "name" && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-full px-3 py-1 text-xs bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white transition"
                onClick={() => onSortChange("name")}
              >
                Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label} ×
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
