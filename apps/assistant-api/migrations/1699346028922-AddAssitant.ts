import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssitant1699346028922 implements MigrationInterface {
    name = 'AddAssitant1699346028922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assistants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deviceToken" character varying NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_55c84703ac63435189afeb29fda" UNIQUE ("deviceToken"), CONSTRAINT "PK_640d8c25456e38fc20f6081d754" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "assistants"`);
    }

}
