import { AltpaymentClient, AltpaymentShift } from ".";
import config from '../../../paybutton-config.json'

export class MockedPaymentClient implements AltpaymentClient {
  public async getPaymentStatus (_id: string): Promise<AltpaymentShift> {
  const res = await fetch(`${config.apiBaseUrl}/altpayment/mocked`);
  return (await res.json()) as AltpaymentShift;
  }
}
