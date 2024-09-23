"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerUpdatedPublisher = void 0;
const core_1 = require("@ebazdev/core");
const customer_event_subjects_1 = require("../../shared/events/customer-event-subjects");
class CustomerUpdatedPublisher extends core_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = customer_event_subjects_1.CustomerEventSubjects.CustomerUpdated;
    }
}
exports.CustomerUpdatedPublisher = CustomerUpdatedPublisher;
