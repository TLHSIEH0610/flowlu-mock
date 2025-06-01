import { getCategories } from "@/actions/category.actions";
import CreateTicketForm from "./form";

export default async function () {
  const categories = await getCategories();

  return <CreateTicketForm categories={categories} />;
}
