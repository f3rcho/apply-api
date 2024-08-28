import { HttpException, NotFoundException } from '@nestjs/common';
import { STATUS_CODE_ERRORS } from '../const/error.const';
import { AppExceptionFilter } from './app-exception.filter';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  url: '/test',
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('AppExceptionFilter', () => {
  let filter: AppExceptionFilter;

  beforeEach(() => {
    jest.clearAllMocks();
    filter = new AppExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('When catch an error', () => {
    it('If the error is a general error instance then the status is 500 and the error message is from STATUS_CODE_ERRORS', () => {
      filter.catch(new Error('Error de prueba'), mockArgumentsHost);
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(500);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        statusCode: 500,
        message: STATUS_CODE_ERRORS[500],
      });
    });

    it('If the error is an HttpException instance and the status is 500 then the error message is from STATUS_CODE_ERRORS', () => {
      filter.catch(
        new HttpException('Error de prueba', 500),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(500);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        statusCode: 500,
        message: STATUS_CODE_ERRORS[500],
      });
    });

    it('If the error is a HttpException instance and the status is 400 then the error message is from the HttpException instance', () => {
      filter.catch(
        new HttpException('Error de prueba', 400),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(400);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        statusCode: 400,
        message: 'Error de prueba',
      });
    });

    it('If the error is a NotFoundException instance then the error message is from the NotFoundException instance', () => {
      filter.catch(
        new NotFoundException('No se ha encontrado el recurso solicitado.'),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(404);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        statusCode: 404,
        message: 'No se ha encontrado el recurso solicitado.',
      });
    });
  });
});
