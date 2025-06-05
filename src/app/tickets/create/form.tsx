"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTicket } from "@/actions/ticket.actions";
import { toast } from "sonner";
import { CategoryProps } from "@/types/ticket";
import { TicketTypes, TicketPriorities } from "@/constants";

const NewTicketForm = ({ categories }: { categories: CategoryProps[] }) => {
  const [state, formAction] = useActionState(createTicket, {
    success: false,
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Ticket submitted successfully!");
      router.push("/tickets");
    }
  }, [state.success, router]);

  return (
    <form
      action={formAction}
      className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">New Issue</h2>
      <select
        name="type"
        defaultValue={TicketTypes[0].value}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {TicketTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>

        <select
          name="categoryId"
          defaultValue={1}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimation
        </label>
        <input
          defaultValue={0}
          type="number"
          name="estimation"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          name="priority"
          defaultValue={TicketPriorities[0].value}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TicketPriorities.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default NewTicketForm;
