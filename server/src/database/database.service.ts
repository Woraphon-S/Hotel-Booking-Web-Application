import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      user: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1');
      this.logger.log('Database connection established successfully');
      
      // init.sql lives under src (dev) or dist (build) depending on how the app is run
      const initScriptPath = path.join(__dirname, 'scripts', 'init.sql');
      let finalPath = initScriptPath;
      if (!fs.existsSync(finalPath)) {
        finalPath = path.join(process.cwd(), 'src', 'database', 'scripts', 'init.sql');
      }

      if (fs.existsSync(finalPath)) {
        await this.runSqlFile(finalPath);
      } else {
        this.logger.warn(`Initialization script not found at ${finalPath}`);
      }
    } catch (error) {
      this.logger.error('Failed to connect to the database', error.stack);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database connection pool closed');
  }

  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      this.logger.debug('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      this.logger.error('Query error', { text, error: error.message });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async runSqlFile(filePath: string): Promise<void> {
    const sql = fs.readFileSync(filePath, 'utf8');
    await this.query(sql);
    this.logger.log(`Executed SQL file: ${path.basename(filePath)}`);
  }
}
