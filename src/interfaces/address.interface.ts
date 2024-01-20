export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string | null;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

export interface AddressResponse {
  statusCode: number;
  body: string;
}
