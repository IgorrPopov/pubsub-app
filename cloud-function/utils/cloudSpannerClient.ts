import { Spanner, Database } from '@google-cloud/spanner';

export class CloudSpannerClient {
  private readonly spanner: Spanner;
  private readonly database: Database;

  constructor(projectId: string, instanceId: string, databaseName: string) {
    this.spanner = new Spanner({ projectId });
    this.database = this.spanner.instance(instanceId).database(databaseName);
  }

  public async insertData<T>(tableName: string, data: T): Promise<T> {
    const table = this.database.table(tableName);

    try {
      await table.insert([ data ]);
      return data;
    } catch (error) {
      throw new Error();
    } finally {
      await this.database.close();
    }
  }
}