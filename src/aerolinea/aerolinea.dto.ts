import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AerolineaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaDeFundacion: string;

  @IsUrl()
  @IsNotEmpty()
  readonly paginaWeb: string;
}
