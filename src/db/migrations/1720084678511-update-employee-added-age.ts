import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeAddedAge1720084678511 implements MigrationInterface {
    name = 'UpdateEmployeeAddedAge1720084678511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "age" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "age"`);
    }

}
