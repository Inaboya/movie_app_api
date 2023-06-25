import { ApiProperty } from '@nestjs/swagger';
import { URL } from 'url';
import Validator from 'validator';

export interface paginationData {
  data: any[];
  skip: number;
  limit: number;
  count: number;
  page: number;
}

export class PaginatedResponseDto {
  @ApiProperty()
  data?: any[];

  @ApiProperty()
  count?: number;

  @ApiProperty()
  totalPages?: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  previousPage: boolean;

  @ApiProperty()
  nextPage: boolean;
}

export const sendPaginatedResponse = (
  metaData: paginationData,
): PaginatedResponseDto => {
  const { skip, count, data, page, limit } = metaData;

  let previousPage = false;
  let nextPage = true;
  const response = {} as PaginatedResponseDto;

  if (skip === 0) {
    if (page >= Math.ceil(count / limit)) {
      previousPage = false;
      nextPage = false;
    } else {
      previousPage = false;
      nextPage = true;
    }
  } else if (page >= Math.ceil(count / limit)) {
    previousPage = true;
    nextPage = false;
  } else if (page < Math.ceil(count / limit)) {
    previousPage = true;
    nextPage = true;
  }

  if (data.length > 0) {
    response.data = data;
    response.count = count;
    response.previousPage = previousPage;
    response.nextPage = nextPage;
    response.totalPages = Math.ceil(count / limit);
    response.currentPage = page;
  }

  return response;
};

export interface CustomRequest extends Request {
  user: {
    id: string;
  };
}

const isEmpty = (value: any) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

export function normalizeUrl(url: string): string {
  if (!url.startsWith('http') && !url.startsWith('https')) {
    url = `https://${url}`;
  }

  const parsedUrl = new URL(url);

  return parsedUrl.toString();
}

export interface DataInput {
  name: string;
  email: string;
  password: string;
  password2: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface error {
  [key: string]: string;
}

export const validateRegisterInput = (data: DataInput) => {
  const errors: error = {};

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export const validateLoginInput = (data: LoginInput) => {
  const errors: error = {};

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
