export interface ApplicationError {
    name: string;
    message: string;
    source: string;
    originalErrorObject?: Error | null;
}

export type ResultTuple<T> = [T, null] | [null, ApplicationError];

export class Result {
    static ok<T>(value: T): ResultTuple<T> {
        return [value, null];
    }

    static error<T>(error: ApplicationError): ResultTuple<T> {
        return [null, error];
    }
} 
