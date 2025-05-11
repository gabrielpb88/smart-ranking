import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class AuthGuard implements CanActivate {
  private region
  private cognitoUserPoolId
  private jwks

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.region = this.configService.get('AWS_REGION');
    this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    this.jwks = jwksClient({
        jwksUri: `https://cognito-idp.${this.region}.amazonaws.com/${this.cognitoUserPoolId}/.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
      });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authorization token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = this.jwtService.decode(token, { complete: true });
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new UnauthorizedException('Invalid token structure');
    }
    const kid = decodedToken.header.kid;
    const key = await this.jwks.getSigningKey(kid);
    const publicKey = key.getPublicKey();

    try {
        this.jwtService.verify(token, {
          secret: publicKey,
          algorithms: ['RS256'],
          issuer: `https://cognito-idp.${this.region}.amazonaws.com/${this.cognitoUserPoolId}`,
        });
  
        request.user = this.jwtService.decode(token);
        return true;
      } catch (err) {
        throw new UnauthorizedException('Token verification failed');
      }
  }  
}