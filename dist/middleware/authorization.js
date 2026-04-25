"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationGQL = exports.Authorization = void 0;
const classError_1 = require("../utils/classError");
const graphql_1 = require("graphql");
const Authorization = ({ accessRoles = [] }) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !accessRoles.includes(userRole)) {
            throw new classError_1.AppError('unAuthorized', 403);
        }
        next();
    };
};
exports.Authorization = Authorization;
const AuthorizationGQL = ({ accessRoles = [], role }) => {
    if (!accessRoles.includes(role)) {
        throw new graphql_1.GraphQLError('unAuthorized', {
            extensions: { code: 'UNAUTHORIZED', statusCode: 403 },
        });
    }
    return true;
};
exports.AuthorizationGQL = AuthorizationGQL;
