import { Injectable, Logger } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    ResendConfirmationCodeCommand,
    InitiateAuthCommand
  } from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

    private cognitoClient: CognitoIdentityProviderClient;
    private region;
    private clientId;
    private clientSecret;
    private accessKeyId
    private secretAccessKey
    private authFlow
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly configService: ConfigService) {
        this.region = this.configService.get('AWS_REGION');
        this.clientId = this.configService.get('COGNITO_CLIENT_ID');
        this.clientSecret = this.configService.get('COGNITO_CLIENT_SECRET');
        this.accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        this.secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        this.authFlow = this.configService.get('COGNITO_AUTH_FLOW');
        this.cognitoClient = new CognitoIdentityProviderClient({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
              },
        });
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

    async login(email: string, password: string): Promise<{ idToken?: string, accessToken?: string, refreshToken?: string } | null> {
        const secretHash = crypto.createHmac('sha256', this.clientSecret).update(email + this.clientId).digest('base64');
        const command = new InitiateAuthCommand({
            ClientId: this.clientId,
            AuthFlow: this.authFlow,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: secretHash,
            },
        });

        try {
            const { AuthenticationResult } = await this.cognitoClient.send(command);
            
            if (!AuthenticationResult) {
                throw Error('Authentication failed');
            } else {
                const { IdToken, AccessToken, RefreshToken } = AuthenticationResult;
                return {
                    idToken: IdToken,
                    accessToken: AccessToken,
                    refreshToken: RefreshToken
                }
            }
        } catch (error) {
            this.logger.error(`Error logging in user: ${JSON.stringify(error.message)}` );
            throw error;
        }
    }
}