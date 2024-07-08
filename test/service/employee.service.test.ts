import { getRepository } from "typeorm";
import { EmployeeRepository } from "../../src/repository/employee.repository";
import { EmployeeService } from "../../src/service/employee.service";
import Employee from "../../src/entity/employee.entity";
import { when } from "jest-when";
import { Role } from "../../src/utils/role.enums";
import Address from "../../src/entity/address.entity";
import Department from "../../src/entity/department.entity";

describe("Employee Service", () => {
  let employeeRepository: EmployeeRepository;
  let employeeService: EmployeeService;
  beforeEach(() => {
    const dataSource = {
      getRepository: jest.fn(),
    };
    employeeRepository = new EmployeeRepository(
      dataSource.getRepository(Employee)
    ) as jest.Mocked<EmployeeRepository>;
    employeeService = new EmployeeService(employeeRepository);
  });

  it("should return all employees", async () => {
    const mockfn = jest.fn(employeeRepository.find).mockResolvedValue([]);
    employeeRepository.find = mockfn;

    const users = await employeeRepository.find();

    expect(users).toEqual([]);
    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  it("should return an employee", async () => {
    const mockfn = jest.fn();
    when(mockfn)
      .calledWith({ id: 1 })
      .mockResolvedValue({
        id: 1,
        name: "Nalin",
        email: "nalingovind@gmail.com",
        age: 22,
        role: "Developer",
        address: {
          line: "Thrissur",
          pincode: "680687",
        },
      } as Employee);
    employeeRepository.findOneBy = mockfn;

    const user1 = await employeeService.getEmployeeById(1);
    if (!user1) return;
    expect(user1.name).toEqual("Nalin");
  });
  it("should delete an employee", async () => {
    const mockfn = jest.fn();
    when(mockfn)
      .calledWith({ id: 1 })
      .mockResolvedValue({
        id: 1,
        name: "Nalin",
        email: "nalingovind@gmail.com",
        age: 22,
        role: "Developer",
        address: {
          line: "Thrissur",
          pincode: "680687",
        },
      } as Employee);
    employeeRepository.softRemove = mockfn;

    const user1 = await employeeService.removeEmployee(1);
    expect(user1).toEqual(undefined);
  });
  it("should create an employee", async () => {
    let mockAddress = new Address();
    mockAddress.line = "Thrissur";
    mockAddress.pincode = "680687";
    let mockDepartment = new Department();
    mockDepartment.name = "Human Resources";
    const mockEmployee: Partial<Employee> = {
      name: "Nalin",
      email: "nalingovind@gmail.com",
      age: 22,
      role: Role.HR,
      address: mockAddress,
      department: mockDepartment,
    };
    const mockfn = jest
      .fn(employeeRepository.create)
      .mockResolvedValue(mockEmployee as Employee);
    employeeRepository.create = mockfn;

    const user1 = await employeeService.createEmployee(
      "nalingovind@gmail.com",
      "Nalin",
      22,
      mockAddress,
      mockDepartment,
      Role.UI,
      "Nalin@007"
    );
    expect(user1.name).toEqual("Nalin");
  });
  it.only("should update an employee", async () => {
    let mockAddress = new Address();
    mockAddress.line = "Thrissur";
    mockAddress.pincode = "680687";
    let mockDepartment = new Department();
    mockDepartment.name = "Human Resources";
    const mockEmployee: Partial<Employee> = {
      id: 1,
      name: "Nalin",
      email: "nalingovind@gmail.com",
      age: 22,
      role: Role.HR,
      address: mockAddress,
      department: mockDepartment,
    };
    const mockfn1 = jest
      .fn(employeeRepository.create)
      .mockResolvedValue(mockEmployee as Employee);
    employeeRepository.create = mockfn1;

    const mockfn2 = jest
      .fn(employeeRepository.findOneBy)
      .mockResolvedValue(mockEmployee as Employee);
    employeeRepository.findOneBy = mockfn2;

    const user1 = await employeeService.updateEmployee(
      1,
      "nalingovind@gmail.com",
      "Govind",
      22,
      mockAddress,
      mockDepartment,
      Role.UI,
      "Nalin@007"
    );
    expect(mockfn2).toHaveBeenCalledTimes(1);
    expect(user1.name).toEqual("Nalin");
  });
});
