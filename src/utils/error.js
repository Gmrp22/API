class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

export class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

export class InternalServerError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}

export class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}

export class NotImplementedError extends AppError {
    constructor(message) {
        super(message, 501);
    }
}

export class BadGatewayError extends AppError {
    constructor(message) {
        super(message, 502);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message) {
        super(message, 503);
    }
}

export class GatewayTimeoutError extends AppError {
    constructor(message) {
        super(message, 504);
    }
}

export class PreconditionFailedError extends AppError {
    constructor(message) {
        super(message, 412);
    }
}

export class ValidationError extends AppError {
    constructor(errors) {
        super('Validation error', 422);
        this.errors = errors;
    }
}

export class AuthenticationError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

export class AuthorizationError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}


export class PrismaConnectionError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}

export class PrismaUniqueConstraintError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

export class PrismaRecordNotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

export class PrismaForeignKeyViolationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

export class PrismaTimeoutError extends AppError {
    constructor(message) {
        super(message, 504);
    }
}

export class PrismaTransactionError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}

export class PrismaTransactionCancelledError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}

export class PrismaTransactionRollbackError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}

export class PrismaTransactionCommitError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
export default AppError;