const ErrorCodeMap: Record<string, number> = {
  EACCES: 403,
  ENOENT: 404,
  EEXIST: 409,
  EPATHINJECTION: 400,
  UNKNOWN: 500,
};

export default ErrorCodeMap;
