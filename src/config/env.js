import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    name: process.env.DB_NAME ?? 'lapakpindah',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-jangan-dipakai-di-server',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
  },
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
};
