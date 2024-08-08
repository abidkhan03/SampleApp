import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: 'secret',
            signOptions: {expiresIn: '1d'},
        }),
    ],
    exports: [
        JwtModule
    ]
})
export class CommonModule {}