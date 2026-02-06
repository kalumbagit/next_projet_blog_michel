import { CategoryInfo } from "@/app/lib/index";
import CategoryRow from "./CategoryRow";

type Props = {
  categories: CategoryInfo[];
  editingId: string | null;
  onEdit: (id: string) => void;
  onSave: (c: CategoryInfo) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
};

export default function CategoriesList(props: Props) {
  return (
    <div className="space-y-4">
      {props.categories.map((category, index) => (
        <CategoryRow
          key={category.id}
          category={category}
          index={index}
          isEditing={props.editingId === category.id}
          {...props}
        />
      ))}
    </div>
  );
}
