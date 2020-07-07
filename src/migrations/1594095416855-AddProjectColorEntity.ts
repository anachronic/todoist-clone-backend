import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProjectColorEntity1594095416855 implements MigrationInterface {
  name = 'AddProjectColorEntity1594095416855'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_color" ("id" SERIAL NOT NULL, "red" integer NOT NULL, "green" integer NOT NULL, "blue" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_fbbabc7a918ebb54da381ea7259" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "project" ADD "color_id" integer`)
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_fbbabc7a918ebb54da381ea7259" FOREIGN KEY ("color_id") REFERENCES "project_color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_fbbabc7a918ebb54da381ea7259"`
    )
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "color_id"`)
    await queryRunner.query(`DROP TABLE "project_color"`)
  }
}
