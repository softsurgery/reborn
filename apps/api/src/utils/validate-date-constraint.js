"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateOrderConstraint = void 0;
const class_validator_1 = require("class-validator");
let DateOrderConstraint = class DateOrderConstraint {
    validate(_, args) {
        const [startField, endField] = args.constraints;
        const obj = args.object;
        const start = obj?.[startField];
        const end = obj?.[endField];
        if (!start || !end)
            return true;
        return new Date(start) < new Date(end);
    }
    defaultMessage(args) {
        const [startField, endField] = args.constraints;
        return `${startField} must be before ${endField}`;
    }
};
exports.DateOrderConstraint = DateOrderConstraint;
exports.DateOrderConstraint = DateOrderConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'DateOrder', async: false })
], DateOrderConstraint);
//# sourceMappingURL=validate-date-constraint.js.map