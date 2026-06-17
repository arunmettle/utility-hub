import { resetValidationSummary } from './utils/validation-reporting';

export default async function globalSetup() {
  resetValidationSummary();
}
