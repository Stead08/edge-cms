import { Validator } from "@cfworker/json-schema"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateJson = (json: any, schema: any) => {
  const validator = new Validator(schema);
  return validator.validate(json);
}
