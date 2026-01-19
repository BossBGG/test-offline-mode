import { IsOptional, IsString } from "class-validator";

export class SyncRequestDto {
  @IsString()
  clientId: string;

  @IsOptional()
  lastSyncAt?: string;

  @IsOptional()
  changes?: {
    created: any[];
    updated: any[];
    deleted: string[];
  };
}