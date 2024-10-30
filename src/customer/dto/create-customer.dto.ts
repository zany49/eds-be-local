import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum ProfileStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
 }

export class CreateCustomerDto {
  @IsNotEmpty()
  companyName: string;

  @IsOptional()
  contactName?: string;

  @IsNotEmpty()
  mobileNumber: string;

  @IsNotEmpty()
  companyEmail: string;

  @IsNotEmpty()
  vatId: string;

  @IsNotEmpty()
  commercialRegId: string;

  @IsEnum(ProfileStatus)
  status: ProfileStatus;

  @IsOptional()
  mailingAddress: {
    addressType: string;
    country: string;
    state: string;
    city: string;
    streetAddress: string;
    additionalAddressInfo?: string;
  };

  @IsOptional()
  pickupAddress?: {
    addressType: string;
    country: string;
    state: string;
    city: string;
    streetAddress: string;
    additionalAddressInfo?: string;
  };

  @IsNotEmpty()
  isPickupSameAsMailing: boolean;

  @IsNotEmpty()
  separateInvoices: boolean;

  @IsNotEmpty()
  contractExpiryDate:string;

  @IsOptional()
  users?: Array<{
    userName: string;
    department: string;
    mobileNumber: string;
    email: string;
    pickupMatchesParent: boolean;
    country: string;
    state: string;
    city: string;
    streetAddress: string;
    additionalAddressInfo?: string;
  }>;
}
