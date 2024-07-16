import { EmployeeRepository } from "../../src/repository/employee.repository";
import { EmployeeService } from "../../src/service/employee.service";
import Employee from "../../src/entity/employee.entity";
import { when } from "jest-when";
import { Role } from "../../src/utils/role.enums";
import Address from "../../src/entity/address.entity";
import Department from "../../src/entity/department.entity";
import { DepartmentService } from "../../src/service/department.service";
import { DepartmentRepository } from "../../src/repository/department.repository";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, JWT_VALIDITY } from "../../src/utils/constants";
import { Status } from "../../src/utils/status.enums";

describe("Employee Service", () => {
  let employeeRepository: EmployeeRepository;
  let employeeService: EmployeeService;
  let departmentService: DepartmentService;

  beforeAll(() => {
    const dataSource = {
      getRepository: jest.fn(),
    };
    employeeRepository = new EmployeeRepository(
      dataSource.getRepository(Employee)
    ) as jest.Mocked<EmployeeRepository>;
    departmentService = new DepartmentService(
      new DepartmentRepository(dataSource.getRepository(Department))
    );
    employeeService = new EmployeeService(
      employeeRepository,
      departmentService
    );
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
        email: "sajita@gmail.com",
        name: "Sajita",
        jdate: new Date("2022-12-12"),
        address: {
          line: "Thrissur",
        },
        department: {
          name: "Human Resources",
        },
        role: "HR",
        password: "Sajita@007",
        status: "Active",
        experience: "10 Years",
      } as Employee);
    employeeRepository.findOneBy = mockfn;

    const user1 = await employeeService.getEmployeeById(1);
    if (!user1) return;
    expect(user1.name).toEqual("Sajita");
  });
  it("should delete an employee", async () => {
    let mockAddress = new Address();
    mockAddress.line = "Thrissur";
    let mockDepartment = new Department();
    mockDepartment.name = "Human Resources";
    const mockEmployee: Partial<Employee> = {
      id: 1,
      name: "Nalin",
      email: "nalingovind@gmail.com",
      jdate: new Date("2022-12-12"),
      role: Role.HR,
      address: mockAddress,
      department: mockDepartment,
      status: Status.Active,
      experience: "5 Years",
    };

    const mockfn1 = jest.fn();
    when(mockfn1)
      .calledWith({ id: 1 })
      .mockResolvedValue(mockEmployee as Employee);
    employeeRepository.findOneBy = mockfn1;

    const mockfn2 = jest
      .fn(employeeRepository.softRemove)
      .mockResolvedValue(mockEmployee as Employee);
    employeeRepository.softRemove = mockfn2;

    const user1 = await employeeService.removeEmployee(1);
    expect(user1).toEqual(user1);
  });
  it("should create an employee", async () => {
    let mockAddress = new Address();
    mockAddress.line = "Thrissur";
    let mockDepartment = new Department();
    mockDepartment.name = "Human Resources";
    const mockEmployee: Partial<Employee> = {
      name: "Nalin",
      email: "nalingovind@gmail.com",
      jdate: new Date("2022-12-12"),
      role: Role.HR,
      address: mockAddress,
      department: mockDepartment,
      status: Status.Active,
      experience: "5 Years",
    };
    const mockfn = jest
      .fn(employeeRepository.create)
      .mockResolvedValue(mockEmployee as Employee);
    employeeRepository.create = mockfn;

    const user1 = await employeeService.createEmployee(
      "nalingovind@gmail.com",
      "Govind",
      new Date("2022-12-12"),
      mockAddress,
      mockDepartment,
      Role.UI,
      "Nalin@007",
      Status.Active,
      "10 Years"
    );
    expect(user1.name).toEqual("Nalin");
  });
  it("should update an employee", async () => {
    let mockAddress = new Address();
    mockAddress.line = "Thrissur";
    let mockDepartment = new Department();
    mockDepartment.name = "Human Resources";
    const mockEmployee: Partial<Employee> = {
      id: 1,
      name: "Nalin",
      email: "nalingovind@gmail.com",
      jdate: new Date("2022-12-12"),
      role: Role.HR,
      address: mockAddress,
      department: mockDepartment,
      status: Status.Active,
      experience: "5 Years",
    };

    const mockfn1 = jest
      .fn(employeeRepository.create)
      .mockResolvedValue(mockEmployee as Employee);
    employeeRepository.create = mockfn1;

    const mockfn2 = jest
      .fn(employeeRepository.findOneBy)
      .mockResolvedValue(mockEmployee as Employee);
    employeeRepository.findOneBy = mockfn2;

    const mockfn3 = jest
      .fn(departmentService.getDepartmentByName)
      .mockResolvedValue(mockDepartment as Department);
    departmentService.getDepartmentByName = mockfn3;

    const user1 = await employeeService.updateEmployee(
      1,
      "nalingovind@gmail.com",
      "Govind",
      new Date("2022-12-12"),
      mockAddress,
      mockDepartment,
      Role.UI,
      // "Nalin@007",
      Status.Active,
      "10 Years"
    );

    expect(user1.name).toEqual("Govind");
  });
  it("should verify an employee login", async () => {
    const payLoad = {
      name: "Nalin Govind V",
      email: "nalingovind@gmail.com",
      role: Role.CEO,
    };
    const mockfn = jest
      .fn(employeeRepository.findOneBy)
      .mockResolvedValue(payLoad as Employee);
    employeeRepository.findOneBy = mockfn;
    const mockfn2 = jest.fn(bcrypt.compare).mockResolvedValue(true as never);
    bcrypt.compare = mockfn2;
    const expectedToken = {
      token: jsonwebtoken.sign(payLoad, JWT_SECRET, {
        expiresIn: JWT_VALIDITY,
      }),
    };

    const authToken = await employeeService.loginEmployee(
      payLoad.email,
      "Nalin@007"
    );
    expect(authToken).toEqual(expectedToken);
  });
});
