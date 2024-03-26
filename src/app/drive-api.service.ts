import { Injectable } from '@angular/core';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable({
  providedIn: 'root'
})
export class DriveApiService {
  // private drive: any;

  // constructor() {
  //   const oauth2Client = new OAuth2Client(
  //     'YOUR_CLIENT_ID',
  //     'YOUR_CLIENT_SECRET',
  //     'YOUR_REDIRECT_URL'
  //   );

  //   oauth2Client.setCredentials({ access_token: 'YOUR_ACCESS_TOKEN' });

  //   this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  // }

  // async uploadFile(file: any) {
  //   const response = await this.drive.files.create({
  //     requestBody: {
  //       name: file.name,
  //       mimeType: file.type
  //     },
  //     media: {
  //       mimeType: file.type,
  //       body: file
  //     }
  //   });

    // return response.data;
  // }
}
