import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, } from "class-validator";

export class UpdatePenalizedDto{

    @ApiProperty({
        example: 'true',
        description: 'It has to be a boolean',
        type: "boolean"
    })
    @IsString()
    @IsNotEmpty()
    isPenalized:string;


}

export class DesactivateUserDto{

    @ApiProperty({
        example: 'true',
        description: 'It has to be a boolean',
        type: "boolean"
    })
    @IsString()
    @IsNotEmpty()
    isActive : string;
}