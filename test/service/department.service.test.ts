import { getRepository } from "typeorm";
import { DepartmentRepository } from "../../src/repository/department.repository";
import { DepartmentService } from "../../src/service/department.service";
import Department from "../../src/entity/department.entity";
import { when } from "jest-when";
import { Role } from "../../src/utils/role.enums";
import Address from "../../src/entity/address.entity";

describe("Department Service", () => {
  let departmentRepository: DepartmentRepository;
  let departmentService: DepartmentService;
  beforeAll(() => {
    const dataSource = {
      getRepository: jest.fn(),
    };
    departmentRepository = new DepartmentRepository(
      dataSource.getRepository(Department)
    ) as jest.Mocked<DepartmentRepository>;
    departmentService = new DepartmentService(departmentRepository);
  });

  it("should return all departments", async () => {
    const mockfn = jest.fn(departmentRepository.find).mockResolvedValue([]);
    departmentRepository.find = mockfn;

    const users = await departmentRepository.find();

    expect(users).toEqual([]);
    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  it("should return an department", async () => {
    const mockfn = jest.fn();
    when(mockfn)
      .calledWith({ id: 1 })
      .mockResolvedValue({
        id: 1,
        name: "Developer",
      } as Department);
    departmentRepository.findOneBy = mockfn;

    const user1 = await departmentService.getDepartmentById(1);
    if (!user1) return;
    expect(user1.name).toEqual("Developer");
  });
  it("should delete an department", async () => {
    const mockfn1 = jest.fn();
    when(mockfn1)
      .calledWith({ id: 1 })
      .mockResolvedValue({
        id: 1,
        name: "Developer",
      } as Department);
    departmentRepository.findOneBy = mockfn1;

    const mockfn2 = jest.fn();
    when(mockfn2)
      .calledWith({ id: 1 })
      .mockResolvedValue({
        id: 1,
        name: "Developer",
      } as Department);
    departmentRepository.softRemove = mockfn2;

    const user1 = await departmentService.removeDepartment(1);
    expect(user1).toEqual(undefined);
  });
  it("should create an department", async () => {
    const mockDepartment: Partial<Department> = {
      name: "Developer",
    };
    const mockfn = jest
      .fn(departmentRepository.create)
      .mockResolvedValue(mockDepartment as Department);
    departmentRepository.create = mockfn;

    const user1 = await departmentService.createDepartment("Developer");
    expect(user1.name).toEqual("Developer");
  });
  it("should update an department", async () => {
    const mockDepartment1: Partial<Department> = {
      name: "Human Resources",
    };
    const mockDepartment2: Partial<Department> = {
      name: "Developer",
    };
    const mockfn1 = jest
      .fn(departmentRepository.create)
      .mockResolvedValue(mockDepartment1 as Department);
    departmentRepository.create = mockfn1;

    const mockfn2 = jest
      .fn(departmentRepository.findOneBy)
      .mockResolvedValue(mockDepartment2 as Department);
    departmentRepository.findOneBy = mockfn2;

    const user1 = await departmentService.updateDepartment(
      1,
      "Human Resources"
    );
    expect(user1.name).toEqual("Human Resources");
  });
});
