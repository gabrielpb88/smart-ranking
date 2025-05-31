import { Controller, UsePipes, Post, ValidationPipe, Body, HttpCode, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/v1/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @UsePipes(ValidationPipe)
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            await this.authService.register(createUserDto);
        } catch (error) {
            return {
                statusCode: 400,
                message: 'Error registering user',
                error: error.message,}
        }
    }

    @Post('/confirm')
    @UsePipes(ValidationPipe)
    async confirmSignUp(@Body() confirmUserDto: ConfirmUserDto) {
        const { email, code } = confirmUserDto;
        try {
            await this.authService.confirmSignUp(email, code);
        } catch (error) {
            return {
                statusCode: 400,
                message: 'Error confirming user',
                error: error.message,}
        }
    }

    @Post('/resend-confirmation')
    @UsePipes(ValidationPipe)
    async resendConfirmationCode(@Body('email') email: string) {
        try {
            await this.authService.resendConfirmationCode(email);
        } catch (error) {
            return {
                statusCode: 400,
                message: 'Error resending confirmation code',
                error: error.message,
            };
        }
    }

    @Post('/login')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async login(@Body() loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        try {
            const response = await this.authService.login(email, password);
            return response
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

}
