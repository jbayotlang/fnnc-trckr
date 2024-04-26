import * as Yup from "yup";

export const ConfigSchema = Yup.object<NodeJS.ProcessEnv>()
  .noUnknown(false)
  .shape({
    NODE_ENV: Yup.string()
      .oneOf(['development', 'production', 'test'])
      .required()
      .default('development'),
    APP_ENV: Yup.string()
      .oneOf(['development', 'staging', 'production', 'test', 'preview'])
      .required()
      .default('development'),
    DB_NAME: Yup.string().required(),
    DB_PORT: Yup.number().required().default(5432),
    DB_PASSWORD: Yup.string().required(),
    DB_USER: Yup.string().required(),
    DB_HOST: Yup.string().required(),

    // JWT
    JWT_SECRET: Yup.string().required(),

    // APP
    APP_PORT: Yup.string().required(),
    APP_HOSTNAME: Yup.string().optional(),
  });

export type ConfigSchemaType = Yup.InferType<typeof ConfigSchema>;
