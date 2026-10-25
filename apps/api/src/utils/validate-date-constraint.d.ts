import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class DateOrderConstraint implements ValidatorConstraintInterface {
    validate(_: unknown, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
