import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmUserDto } from './dto/confirm-user.dto';


describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                        confirmSignUp: jest.fn(),
                        resendConfirmationCode: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('register', () => {
        it('should call authService.register with correct data', async () => {
            const createUserDto: CreateUserDto = { email: 'valid@email.com', password: 'Valid123.', name: 'Valid name', phoneNumber: '+55900000000' };
            await authController.register(createUserDto);
            expect(authService.register).toHaveBeenCalledWith(createUserDto);
        });

        it('should return error response if authService.register throws', async () => {
            const createUserDto: CreateUserDto = { email: 'valid@email.com', password: 'Valid123.', name: 'Valid name', phoneNumber: '+55900000000' };
            jest.spyOn(authService, 'register').mockRejectedValue(new Error('Registration failed'));
            const response = await authController.register(createUserDto);
            expect(response).toEqual({
                statusCode: 400,
                message: 'Error registering user',
                error: 'Registration failed',
            });
        });
    });

    describe('confirmSignUp', () => {
        it('should call authService.confirmSignUp with correct email and code', async () => {
            const confirmUserDto: ConfirmUserDto = { email: 'test@example.com', code: '123456' };
            await authController.confirmSignUp(confirmUserDto);
            expect(authService.confirmSignUp).toHaveBeenCalledWith('test@example.com', '123456');
        });

        it('should return error response if authService.confirmSignUp throws', async () => {
            const confirmUserDto: ConfirmUserDto = { email: 'test@example.com', code: '123456' };
            jest.spyOn(authService, 'confirmSignUp').mockRejectedValue(new Error('Confirmation failed'));
            const response = await authController.confirmSignUp(confirmUserDto);
            expect(response).toEqual({
                statusCode: 400,
                message: 'Error confirming user',
                error: 'Confirmation failed',
            });
        });
    });

    describe('resendConfirmationCode', () => {
        it('should call authService.resendConfirmationCode with correct email', async () => {
            const email = 'test@example.com';
            await authController.resendConfirmationCode(email);
            expect(authService.resendConfirmationCode).toHaveBeenCalledWith(email);
        });

        it('should return error response if authService.resendConfirmationCode throws', async () => {
            const email = 'test@example.com';
            jest.spyOn(authService, 'resendConfirmationCode').mockRejectedValue(new Error('Resend failed'));
            const response = await authController.resendConfirmationCode(email);
            expect(response).toEqual({
                statusCode: 400,
                message: 'Error resending confirmation code',
                error: 'Resend failed',
            });
        });
    });
});