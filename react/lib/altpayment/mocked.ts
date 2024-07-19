import { AltpaymentClient, AltpaymentPayment } from ".";
const BASE_MOCKED_URL = 'WIP'

export class MockedPaymentClient implements AltpaymentClient {
  public async getPaymentStatus (id: string): Promise<AltpaymentPayment> {
  const res = await fetch(`${BASE_MOCKED_URL}/shifts/${id}?t=${(new Date()).getTime()}`);
  return (await res.json()) as AltpaymentPayment;
  }
}
