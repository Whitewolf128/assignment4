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