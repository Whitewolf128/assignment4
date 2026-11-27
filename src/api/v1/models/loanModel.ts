/**
 * Represents an item in the system
 */
export interface Loan {
    id: number;
    applicant: string;
    amount: number;
    status: string;
    createdAt: Date;
}