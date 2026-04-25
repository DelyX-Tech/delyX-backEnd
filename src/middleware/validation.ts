import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/classError";

type requestType = keyof Request;
type schemaType = Partial<Record<requestType, ZodType>>;

export const validation = (schema: schemaType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationError: any[] = [];

        for (const key of Object.keys(schema) as requestType[]) {
            if (!schema[key]) continue;

            const result = schema[key]!.safeParse(req[key]);

            if (!result.success) {
                validationError.push(result.error);
            }
        }

        if (validationError.length) {
            throw new AppError(
                JSON.parse(JSON.stringify(validationError)),
                400
            );
        }

        next();
    };
};