export interface TicketProps {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  estimation: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: number;
}
