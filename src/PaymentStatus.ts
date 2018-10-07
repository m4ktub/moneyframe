/**
 * Representation of the payment status for an item.
 */
 export class PaymentStatus {

   /**
    * @param paid If the item is considered paid.
    * @param endTime The time until when the item is paid, in unix format.
    * @param confirmations The number of confirmations since last payment.
    */
   constructor(readonly paid: boolean, readonly endTime: number, readonly confirmations: number) {
   }

   /**
    * @return A `Date` constructed from `endTime`.
    */
   getEndTimeAsDate(): Date {
     return new Date(this.endTime);
   }

   /**
    * Creates a basic unpaid `PaymentStatus` to be used as a fallback, when a
    * value is desired.
    *
    * @return A `PaymentStatus` that is unpaid since just now.
    */
   static unpaid(): PaymentStatus {
     return new PaymentStatus(false, Date.now(), 0);
   }

 }
