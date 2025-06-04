"use client";

import { useActionState, useEffect } from "react";
import { createTicket } from "@/actions/ticket.actions";
import { toast } from "sonner";

const SimpleTicketForm = ({
  setShowForm,
  categoryId,
  refreshCategories,
}: {
  setShowForm: (arg: boolean) => void;
  categoryId: number;
  refreshCategories: () => void;
}) => {
  const [state, formAction] = useActionState(createTicket, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Ticket submitted successfully!");
      setShowForm(false);
      refreshCategories();
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="bg-white p-4 rounded shadow-md flex flex-col gap-2"
    >
      <input
        type="text"
        className="border px-2 py-1 rounded"
        placeholder="Add a task and press Enter"
        name="title"
        autoFocus
      />
      <textarea
        className="border px-2 py-1 rounded"
        placeholder="Description"
        name="description"
      />
      <input type="hidden" name="categoryId" value={categoryId} />
      <div className="flex justify-between mt-2">
        <button
          className="text-sm text-gray-500 hover:underline"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default SimpleTicketForm;
