import { Sequence } from "@ebazdev/core";
import moment from "moment";

export const getCustomerNumber = async (code: string): Promise<any> => {
  const duration = moment().format("YY");

  let sequence = await Sequence.findOneAndUpdate(
    { code, duration },
    { $inc: { seq: 1 } }
  );

  if (!sequence) {
    sequence = await Sequence.create({ code, duration, seq: 1 });
  }
  return `${code}${duration}${sequence.seq}`;
};
