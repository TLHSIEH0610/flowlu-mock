import { Priority, TicketType } from "@prisma/client";

export interface TicketProps {
  id: string;
  type?: TicketType | null;
  title: string;
  description: string;
  priority?: Priority | null;
  estimation?: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: number;
}

export interface CategoryProps {
  id: number;
  name: string;
  tickets: TicketProps[];
}
