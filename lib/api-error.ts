import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN_ROLE"
  | "TENANT_MISMATCH"
  | "TICKET_ALREADY_SOLD"
  | "PACK_NOT_ACTIVATED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "FEATURE_DISABLED"
  | "BILLING_RESTRICTED";

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  console.error(error);
  return NextResponse.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message: "An unexpected error occurred",
      },
    },
    { status: 500 },
  );
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
