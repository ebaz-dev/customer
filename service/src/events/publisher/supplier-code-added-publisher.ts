import { Publisher } from "@ebazdev/core";
import { SupplierCodeAddedEvent, CustomerEventSubjects } from "../../shared";

export class SupplierCodeAddedPublisher extends Publisher<SupplierCodeAddedEvent> {
  subject: CustomerEventSubjects.SupplierCodeAdded =
    CustomerEventSubjects.SupplierCodeAdded;
}
