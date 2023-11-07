import {
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('assistants')
  export class Assistant {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Unique('deviceToken', ['deviceToken'])
    deviceToken: string;
  
    @CreateDateColumn({ name: 'createdAt', nullable: true })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updatedAt', nullable: true })
    updatedAt: Date;
  }
  