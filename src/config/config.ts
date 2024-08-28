import { registerAs } from '@nestjs/config';
import { PORT } from '../common/const/env.const';

const getProcessParam = (key: string, defaultValue?: any): any => {
  return process.env[key] || defaultValue;
};

export default registerAs('config', () => {
  return {
    api: {
      API_KEY: process.env.API_KEY,
      PORT: process.env.PORT || PORT,
      HTTP_TIMEOUT: process.env.HTTP_TIMEOUT || 5000,
      HTTP_MAX_REDIRECTS: process.env.HTTP_MAX_REDIRECTS || 5,
    },
    contentful: {
      baseUrl: getProcessParam('CONTENTFUL_BASE_URL'),
      spaceId: getProcessParam('CONTENTFUL_SPACE_ID') || '',
      accessToken: getProcessParam('CONTENTFUL_ACCESS_TOKEN'),
      environment: getProcessParam('CONTENTFUL_ENVIRONMENT'),
      contentType: getProcessParam('CONTENTFUL_CONTENT_TYPE'),
    },
    postgres: {
      dbName: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      password: process.env.POSTGRES_PASSWORD,
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
    },
  };
});
