import { AltpaymentClient, AltpaymentPayment } from ".";
import config from '../config.json'

export class MockedPaymentClient implements AltpaymentClient {
  public async getPaymentStatus (_id: string): Promise<AltpaymentPayment> {
  const res = await fetch(`${config.apiBaseUrl}/sideshift/mocked`);
  return (await res.json()) as AltpaymentPayment;
  }
}
