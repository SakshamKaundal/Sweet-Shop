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
    <div className="space-y-8 p-6 bg-card rounded-2xl border shadow-sm">
      <Accordion type="multiple" defaultValue={["categories"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="font-semibold text-lg">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={`rounded-full px-4 py-1 text-sm ${
                    selectedCategory === category
                      ? "bg-gradient-primary text-primary-foreground shadow"
                      : "hover:bg-muted"
                  } transition`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sort-by">
          <AccordionTrigger className="font-semibold text-lg">Sort By</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 pt-4">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange(option.value)}
                  className={`rounded-lg px-3 text-xs transition ${
                    sortBy === option.value
                      ? "bg-gradient-secondary text-secondary-foreground shadow"
                      : "hover:bg-muted"
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
          <h3 className="font-semibold text-lg mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "All" && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-full px-3 py-1 hover:bg-destructive hover:text-destructive-foreground transition"
                onClick={() => onCategoryChange("All")}
              >
                Category: {selectedCategory} ×
              </Badge>
            )}
            {sortBy !== "name" && (
              <Badge
                variant="secondary"
                className="cursor-pointer rounded-full px-3 py-1 hover:bg-destructive hover:text-destructive-foreground transition"
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
