import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressModified1721063882283 implements MigrationInterface {
    name = 'AddressModified1721063882283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "pincode"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ADD "pincode" character varying NOT NULL`);
    }

}
