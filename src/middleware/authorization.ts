import { NextFunction, Request, Response } from 'express';
import { RoleType } from '../model/user.model';
import { AppError } from '../utils/classError';
import { GraphQLError } from 'graphql';

// Express Middleware
export const Authorization = ({ accessRoles = [] }: { accessRoles: RoleType[] }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !accessRoles.includes(userRole)) {
      throw new AppError('unAuthorized', 403);
    }
    next();
  };
};

// GraphQL Resolver
export const AuthorizationGQL = ({ accessRoles = [], role }: { accessRoles: RoleType[]; role: RoleType }) => {
  if (!accessRoles.includes(role)) {
    throw new GraphQLError('unAuthorized', {
      extensions: { code: 'UNAUTHORIZED', statusCode: 403 },
    });
  }
  return true;
};
