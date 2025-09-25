import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  onSortChange
}: SweetFiltersProps) => {
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
  ];

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl shadow-soft border">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={`${
                selectedCategory === category
                  ? "bg-gradient-primary text-primary-foreground"
                  : "hover:bg-accent"
              } transition-all duration-200`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Sort By</h3>
        <div className="grid grid-cols-2 gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onSortChange(option.value)}
              className={`${
                sortBy === option.value
                  ? "bg-gradient-secondary text-secondary-foreground"
                  : "hover:bg-muted"
              } text-xs transition-all duration-200`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "All" || sortBy !== "name") && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
                Category: {selectedCategory} ×
              </Badge>
            )}
            {sortBy !== "name" && (
              <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
                Sort: {sortOptions.find(opt => opt.value === sortBy)?.label} ×
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};