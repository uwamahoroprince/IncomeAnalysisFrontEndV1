export const BackendPort = 5000;
const baseUrl = `http://localhost:${BackendPort}/IncomeAnalysis`;
export const url = {
  acoount: `${baseUrl}/account`,
  authentication: `${baseUrl}/authentication`,
  register: `${baseUrl}/register`,
  memberShip: `${baseUrl}/memberShip`,
  activity: `${baseUrl}/activity`,
  budgetPlan: `${baseUrl}/budgetPlan`,
  transaction: `${baseUrl}/transaction`,
  client: `${baseUrl}/client`,
};
