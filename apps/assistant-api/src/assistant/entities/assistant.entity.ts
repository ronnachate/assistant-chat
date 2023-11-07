import {
  Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('assistants')
  export class Assistant {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    deviceToken: string;
  
    @CreateDateColumn({ name: 'createdAt', nullable: true })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updatedAt', nullable: true })
    updatedAt: Date;
  }
  