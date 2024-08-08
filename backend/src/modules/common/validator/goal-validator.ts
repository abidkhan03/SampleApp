import validator from 'validator';

export class GoalValidator {
    static validate(body: {
        goalName: string;
        startWeight: string;
        goalWeight: string;
        currentWeight: string;
        startDate: string;
        endtDate: string;
    },
        toValidate: string[]) {
        const errors: string[] = [];

        if (toValidate.includes('goalName') &&
            validator.isEmpty(body.goalName)) {
            errors.push('Name cannot be empty');
        }

        if (toValidate.includes('startWeight') &&
            validator.isEmpty(body.startWeight)) {
            errors.push('Start weight cannot be empty');
        }

        if (
            toValidate.includes('goalWeight') &&
            validator.isEmpty(body.goalWeight)
        ) {
            errors.push('Goal weight cannot be empty');
        }

        if (
            toValidate.includes('currentWeight') &&
            validator.isEmpty(body.currentWeight)
        ) {
            errors.push('Current Weight cannot be empty');
        }

        if (
            toValidate.includes('startDate') &&
            validator.isEmpty(body.startDate)
        ) {
            errors.push('Start Date cannot be empty');
        }

        if (
            toValidate.includes('endtDate') &&
            validator.isEmpty(body.endtDate)
        ) {
            errors.push('End Date cannot be empty');
        }

        return errors;
    }
}