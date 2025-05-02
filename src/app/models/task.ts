export interface Task {
    name :string;
    description: string;
    status: string;
    dueDate: Date;
    priority: string;
    assignedTo: string;
    createdBy: string;
    action : { type: string; url?: string; };
}