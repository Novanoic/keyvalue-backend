import FizzBuzz from "../../src/utils/fizzBuzz.util";

describe("fizzBuzz test", () => {
  let fizzBuzz: FizzBuzz;
  beforeEach(() => {
    fizzBuzz = new FizzBuzz();
  });
  it('Should return "Fizz" for numbers divisible by 3', () => {
    expect(fizzBuzz.fizzBuzz(3)).toBe("Fizz");
    expect(fizzBuzz.fizzBuzz(6)).toBe("Fizz");
  });
  it('Should return "Fizz" for numbers divisible by 5', () => {
    expect(fizzBuzz.fizzBuzz(5)).toBe("Buzz");
    expect(fizzBuzz.fizzBuzz(10)).toBe("Buzz");
  });
  it('Should return "Fizz" for numbers divisible by 15', () => {
    expect(fizzBuzz.fizzBuzz(15)).toBe("FizzBuzz");
  });

  it("using mocks", () => {
    let mockFn = jest.fn(fizzBuzz.divisibleByThree).mockReturnValue(true);
    fizzBuzz.divisibleByThree = mockFn;
    expect(fizzBuzz.fizzBuzz(4)).toBe("Fizz");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("using spy", () => {
    let spy = jest.spyOn(fizzBuzz, "divisibleByThree");
    expect(fizzBuzz.fizzBuzz(4)).toBe(4);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
