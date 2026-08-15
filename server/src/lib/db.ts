import "reflect-metadata";
import {BaseEntity, DataSource, EntityManager} from "typeorm";
import config from "@config/orm.config";
import {dbLogger as logger} from "@config/winston.config";
let _datasource: DataSource;

export const initDatasource = async () => {
  if (_datasource == null) {
    const datasource = new DataSource({...config, type: "mariadb"});
    try {
      logger.info("try to database connect... ");
      const startDate = new Date();
      _datasource = await datasource.initialize();
      // 한글 주석: Active Record(Entity.find 등)가 DataSource를 쓰도록 등록
      BaseEntity.useDataSource(_datasource);
      const endDate = new Date();
      logger.info(`database connected! elapsed time ${endDate.getTime() - startDate.getTime()}ms`);
    } catch (err: any) {
      logger.error(err);
      throw new Error(err);
    }
  }
  return _datasource;
};

export const txProcess = async (callback: (manager: EntityManager) => Promise<any>) => {
  const queryRunner = _datasource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const manager: EntityManager = queryRunner.manager;
    const result: any = await callback(manager);
    await queryRunner.commitTransaction();
    return result;
  } catch (err: any) {
    await queryRunner.rollbackTransaction();
    throw Error(err);
  } finally {
    await queryRunner.release();
  }
};

// 한글 주석: QueryRunner를 새로 만들지 않고 공유 manager 사용 (연결 누수 방지)
export function getManager(): EntityManager {
  if (_datasource == null || !_datasource.isInitialized) {
    throw new Error("DataSource is not initialized");
  }
  return _datasource.manager;
}
