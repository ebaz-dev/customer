import { Publisher } from "@ebazdev/core";
import { CustomerEventSubjects } from "../../shared/events/customer-event-subjects";
import { CustomerUpdatedEvent } from "../../shared/events/customer-update-event";

export class CustomerUpdatedPublisher extends Publisher<CustomerUpdatedEvent> {
  subject: CustomerEventSubjects.CustomerUpdated =
    CustomerEventSubjects.CustomerUpdated;
}
