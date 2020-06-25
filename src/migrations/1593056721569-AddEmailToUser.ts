import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEmailToUser1593056721569 implements MigrationInterface {
    name = 'AddEmailToUser1593056721569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    }

}
