import {MigrationInterface, QueryRunner} from "typeorm";

export class AddScheduleDateToTask1593236797802 implements MigrationInterface {
    name = 'AddScheduleDateToTask1593236797802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "schedule" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "schedule"`);
    }

}
