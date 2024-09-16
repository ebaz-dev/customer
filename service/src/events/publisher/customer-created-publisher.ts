import { Publisher } from "@ebazdev/core";
import { CustomerCreatedEvent } from "../../shared/events/customer-create-event";
import { CustomerEventSubjects } from "../../shared/events/customer-event-subjects";

export class CustomerCreatedPublisher extends Publisher<CustomerCreatedEvent> {
  subject: CustomerEventSubjects.CustomerCreated =
    CustomerEventSubjects.CustomerCreated;
}
