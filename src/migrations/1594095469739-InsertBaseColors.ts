import { MigrationInterface, QueryRunner } from 'typeorm'

export class InsertBaseColors1594095469739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    insert into "project_color" (red, green, blue, name)
    values
    (184, 37, 95, 'Berry Red'),
    (219, 64, 53, 'Red'),
    (255, 153, 51, 'Orange'),
    (250, 208, 0, 'Yellow'),
    (175, 184, 59, 'Olive Green'),
    (126, 204, 73, 'Lime Green'),
    (41, 148, 56, 'Green'),
    (106, 204, 188, 'Mint Green'),
    (21, 143, 173, 'Teal'),
    (20, 170, 245, 'Sky Blue'),
    (150, 195, 235, 'Light Blue'),
    (64, 115, 255, 'Blue'),
    (136, 77, 255, 'Grape'),
    (175, 56, 235, 'Violet'),
    (235, 150, 235, 'Lavender'),
    (224, 81, 148, 'Magenta'),
    (255, 141, 133, 'Salmon'),
    (128, 128, 128, 'Charcoal'),
    (184, 184, 184, 'Grey'),
    (204, 172, 147, 'Taupe');
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    delete from "project_color"
    `)
  }
}
