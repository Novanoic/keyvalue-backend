import { getRepository } from "typeorm";
import { EmployeeRepository } from "../../src/repository/employee.repository";
import { EmployeeService } from "../../src/service/employee.service";
import Employee from "../../src/entity/employee.entity";
import { when } from "jest-when";

describe("Employee Service", () => {
  let employeeRepository: EmployeeRepository;
  let employeeService: EmployeeService;
  beforeAll(() => {
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
    const employee = {
      id: 1,
      email: "navaneeth@gmail.com",
      name: "Navaneeth",
    };
    const mockfn = jest.fn();
    when(mockfn)
      .calledWith({ id: 2 })
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
    // const user2 = await employeeService.getEmployeeById(2);
    if (!user1) return;
    // expect(user2.name).toEqual("Navaneeth");
    expect(user1.name).toEqual("Nalin");
    // expect(mock)
  });
});
