/* istanbul ignore file */
export const ERRORS = {
  HTTP_FORBIDDEN_RESOURCE:
    'No tiene permisos para realizar la operación solicitada.',
  HTTP_SERVER_ERROR:
    'Ha ocurrido un error y no hemos logrado realizar su operación, intentelo de nuevo mas adelante.',
};

export const STATUS_CODE_ERRORS = {
  403: ERRORS.HTTP_FORBIDDEN_RESOURCE,
  500: ERRORS.HTTP_SERVER_ERROR,
};
