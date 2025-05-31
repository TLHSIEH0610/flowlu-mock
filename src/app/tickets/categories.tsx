import { getCategories } from "@/actions/category.actions";

interface categoryProps {
  id: number;
  name: string;
}

export default async function () {
  const categories = await getCategories();

  return categories.map((cat: categoryProps) => <div>{cat.name}</div>);
}
