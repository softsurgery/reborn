import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateOrder', async: false })
export class DateOrderConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const [startField, endField] = args.constraints;
    const obj = args.object as Record<string, unknown>;

    const start = obj[startField as string];
    const end = obj[endField as string];

    if (!start || !end) return true;

    return new Date(String(start)) < new Date(String(end));
  }

  defaultMessage(args: ValidationArguments) {
    const [startField, endField] = args.constraints;
    return `${startField} must be before ${endField}`;
  }
}
