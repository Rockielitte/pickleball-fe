type IBookingReceipt = {
  _id: string;
  type: string;
  paymentType: string;
  paymentMethod: string;
  totalPrice: number;
  totalHour: number;
  startDate: string;
  endDate: string;
  status: string;
  court: {
    name: string;
    type: string;
    price: number;
    images: Array<string>;
    description: string;
    status: string;
    branch: {
      name: string;
      images: Array<string>;
    };
  };
};
export default IBookingReceipt;
