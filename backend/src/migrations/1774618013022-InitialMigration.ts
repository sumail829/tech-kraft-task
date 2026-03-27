import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1774618013022 implements MigrationInterface {
    name = 'InitialMigration1774618013022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agent" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "is_admin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_c8e51500f3876fa1bbd4483ecc1" UNIQUE ("email"), CONSTRAINT "PK_1000e989398c5d4ed585cf9a46f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "suburb" character varying NOT NULL, "propertyType" character varying NOT NULL, "price" integer NOT NULL, "beds" integer NOT NULL, "baths" integer NOT NULL, "internalStatusNotes" character varying, "agentId" integer, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f70b4058f83f66715ec9476c00" ON "property" ("suburb") `);
        await queryRunner.query(`CREATE INDEX "IDX_00e520a6080c91e446e09ea6d8" ON "property" ("propertyType") `);
        await queryRunner.query(`CREATE INDEX "IDX_4a782d3b3733eaedebc40e6780" ON "property" ("price") `);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_3df22387cc25ecbbe851a57fd32" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_3df22387cc25ecbbe851a57fd32"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a782d3b3733eaedebc40e6780"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00e520a6080c91e446e09ea6d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f70b4058f83f66715ec9476c00"`);
        await queryRunner.query(`DROP TABLE "property"`);
        await queryRunner.query(`DROP TABLE "agent"`);
    }

}
