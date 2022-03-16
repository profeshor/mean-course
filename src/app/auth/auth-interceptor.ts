import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor( private authService: AuthService) {};

    intercept( req: HttpRequest<any>, next: HttpHandler) {
        const auhtToken = this.authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + auhtToken)
        })
        console.log ("intercepts?" + auhtToken);
        return next.handle(authRequest);
    }
}
