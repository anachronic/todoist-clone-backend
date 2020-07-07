import { BaseEntity, PrimaryGeneratedColumn, Entity, Column } from 'typeorm'

@Entity()
export class ProjectColor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  red: number

  @Column({ type: 'int' })
  green: number

  @Column({ type: 'int' })
  blue: number

  @Column()
  name: string
}
