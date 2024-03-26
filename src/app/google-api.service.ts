import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '933282398025-hb6lr2bbn0ld83di2mdrdma9focmjo0o.apps.googleusercontent.com',
  scope: 'openid profile email https://www.googleapis.com/auth/drive' 
};

export interface UserInfo {
  info: {
    sub: string;
    email?: string;
    name: string;
    picture: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  userProfileSubject = new Subject<UserInfo>();
  accessToken: string | undefined;

  constructor(private readonly oAuthService: OAuthService, private http: HttpClient) {
    oAuthService.configure(oAuthConfig);
    oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';
    oAuthService.loadDiscoveryDocument().then(() => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          oAuthService.initLoginFlow();
        } else {
          this.accessToken = this.oAuthService.getAccessToken();
          oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo);
          });
        }
      });
    });
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signOut() {
    this.oAuthService.logOut();
  }

  uploadFile(file: File): Observable<any> {
    if (!this.accessToken) {
      console.error('Access token not found.');
      return throwError('Access token not found.');
    }
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`
    });

    return this.http.post<any>('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', formData, { headers });
  }

  downloadFile(fileId: string): Observable<any> {
    if (!this.accessToken) {
      console.error('Access token not found.');
      return throwError('Access token not found.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`
    });

    const params = new HttpParams().set('alt', 'media');

    return this.http.get<any>(`https://www.googleapis.com/drive/v3/files/${fileId}`, { headers, params, responseType: 'text' as 'json' });
  }
}
