import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @IsString()
  @ApiProperty({ description: 'products SKU ' })
  readonly sku: string;

  @IsString()
  @ApiProperty({ description: 'products Name ' })
  readonly name: string;

  @IsString()
  @ApiProperty({ description: 'products model ' })
  readonly model: string;

  @IsString()
  @ApiProperty({ description: 'products category ' })
  readonly category: string;

  @IsString()
  @ApiProperty({ description: 'products color ' })
  readonly color: string;

  @IsString()
  @ApiProperty({ description: 'products currency ' })
  readonly currency: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'porducts Price ' })
  readonly price: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'products stock' })
  readonly stock: number;

  @IsString()
  @ApiProperty({ description: 'products brand' })
  readonly brand: string;
}
export class UpdateProductDto extends CreateProductDto {}

export class FilterProductDto {
  @IsNumber()
  @IsPositive()
  limit: number;

  @ValidateIf((item) => item.limit)
  @IsNumber()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @Min(0)
  minPrice: number;

  @IsOptional()
  @ValidateIf((item) => item.minPrice)
  @Min(0)
  maxPrice: number;
}
