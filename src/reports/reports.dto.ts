import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class ReportsDto {
  @IsBoolean()
  hasPrice: boolean;

  @IsOptional()
  @IsDate()
  init: Date;

  @IsOptional()
  @IsDate()
  end: Date;
}

export class GenerateReport extends ReportsDto {
  @IsOptional()
  @IsString()
  category: string;
}
