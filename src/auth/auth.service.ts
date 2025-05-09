import { Injectable, Logger } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    ResendConfirmationCodeCommand
  } from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

    private cognitoClient: CognitoIdentityProviderClient;
    private region;
    private clientId;
    private clientSecret;
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly configService: ConfigService) {
        this.region = this.configService.get('AWS_REGION');
        this.clientId = this.configService.get('COGNITO_CLIENT_ID');
        this.clientSecret = this.configService.get('COGNITO_CLIENT_SECRET');
        this.cognitoClient = new CognitoIdentityProviderClient({ region: this.region });
    }

    async register(createUserDto: CreateUserDto): Promise<void> {
        const { email, password, phoneNumber } = createUserDto;
        const secretHash = crypto.createHmac('sha256', this.clientSecret).update(email + this.clientId).digest('base64');

        const command = new SignUpCommand({
            ClientId: this.clientId,
            SecretHash: secretHash,
            Username: email,
            Password: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
                {
                    Name: 'phone_number',
                    Value: phoneNumber,
                }
            ],
        });

        try {
            await this.cognitoClient.send(command);
        } catch (error) {
            this.logger.error(`Error registering user: ${JSON.stringify(error.message)}` );
            throw error;
        }
    }

    async confirmSignUp(email: string, code: string) {
        const secretHash = crypto.createHmac('sha256', this.clientSecret).update(email + this.clientId).digest('base64');

        const command = new ConfirmSignUpCommand({
            ClientId: this.clientId,
            SecretHash: secretHash,
            Username: email,
            ConfirmationCode: code,
        });

        try {
            await this.cognitoClient.send(command);
        } catch (error) {
            this.logger.error(`Error confirming user: ${JSON.stringify(error.message)}` );
            throw error;
        }
    }

    async resendConfirmationCode(email: string) {
        const secretHash = crypto.createHmac('sha256', this.clientSecret).update(email + this.clientId).digest('base64');

        const command = new ResendConfirmationCodeCommand({
            ClientId: this.clientId,
            SecretHash: secretHash,
            Username: email,
        });

        try {
            await this.cognitoClient.send(command);
        } catch (error) {
            this.logger.error(`Error resending confirmation code: ${JSON.stringify(error.message)}` );
            throw error;
        }
    }
}