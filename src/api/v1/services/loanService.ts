import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
    Timestamp,
} from "firebase-admin/firestore";

import { Loan } from "../models/loanModel";

import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// reference to the firestore collection name
const COLLECTION: string = "loans";

/**
 * Retrieves all projects from storage
 * @returns Array of all projects
 */

export const getAllLoans = async (): Promise<Loan[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const loans: Loan[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt,
            } as unknown as Loan;
        });

        return loans;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new Loan
 * @param LoanData - The data for the new Loan (name and description)
 * @returns The created Loan with generated ID
 */

export const createLoan = async (loanData: {
    name: string;
    status: string
}): Promise<Loan> => {
    const dateNow = new Date();
    const newLoan: Partial<Loan> = {
        ...loanData,
        createdAt: dateNow,
    };

    const LoanId: string = await createDocument<Loan>(COLLECTION, newLoan);

    return structuredClone({ id: LoanId, ...newLoan } as Loan);
};

/**
 * Retrieves a single Loan by ID from the database
 * @param id - This ID of the Loan to retrieve
 * @returns The Loan if found
 */

export const getLoanById = async (id: string): Promise<Loan> => {
    const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

    if (!doc) {
        throw new Error(`Loan with ID ${id} not found`);
    }

    const data: DocumentData | undefined = doc.data();
    const Loan: Loan = {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : data?.createdAt,
    } as unknown as Loan;

    return structuredClone(Loan);
};

/**
 * Updates (replaces) an existing Loan
 * @param id - The ID of the Loan to update
 * @param LoanData - The fields to updates (name and/or description)
 * @returns The updated Loan
 * @throws Error if Loan with given ID is not found
 */

export const updateLoan = async (
    id: string,
    loanData: Pick<Loan, "applicant" | "status" | "amount">
): Promise<Loan> => {
    // check if the Loan exists before updating
    const Loan: Loan = await getLoanById(id);
    if (!Loan) {
        throw new Error(`Project with ID ${id} not found`);
    }

    const updateLoan: Loan  = {
        ...Loan,
    };

    // I went for the simple option to only update defined values, you could also use an Object method like Object.entries() to be less verbose
    if (loanData.applicant !== undefined) updateLoan.applicant = loanData.applicant;
    if(loanData.status !== undefined) updateLoan.status = loanData.status;
    if(loanData.amount !== undefined) updateLoan.amount = loanData.amount;
    await updateDocument<Loan>(COLLECTION, id, updateLoan);

    return structuredClone(updateLoan);
};