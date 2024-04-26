import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1713971931767 implements MigrationInterface {
    name = 'Users1713971931767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "setting" character varying NOT NULL, "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_50aa50cd542e360ea75bf4eaa7" UNIQUE ("userId"), CONSTRAINT "PK_5cb73472aaca5c0cf69e74d870e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_authmethod_enum" AS ENUM('local', 'google')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying, "emailAddress" character varying, "password" character varying, "authMethod" "public"."user_authmethod_enum" NOT NULL DEFAULT 'local', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0c61a351a894d9c99d9940d6e8d" UNIQUE ("emailAddress", "username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_config" ADD CONSTRAINT "FK_50aa50cd542e360ea75bf4eaa74" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "user_config" DROP CONSTRAINT "FK_50aa50cd542e360ea75bf4eaa74"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_authmethod_enum"`);
        await queryRunner.query(`DROP TABLE "user_config"`);
    }

}
