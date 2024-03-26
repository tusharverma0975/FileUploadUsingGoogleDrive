import { Component } from '@angular/core';
import { GoogleApiService, UserInfo } from './google-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'driveOauth'; 
  userInfo?: UserInfo;
  selectedFile: File | undefined;
  encryptionPassphrase = '79wr9e898998898w088880880';
  uploadedFileId: string | undefined;

  constructor(
    private readonly googleApi: GoogleApiService,
    private readonly http: HttpClient
  ) {
    googleApi.userProfileSubject.subscribe(info => {
      this.userInfo = info;
    });
  }

  isLoggedIn(): boolean {
    return !!this.googleApi && this.googleApi.isLoggedIn();
  }

  logout() {
    if (this.googleApi) {
      this.googleApi.signOut();
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files?.[0];
  }
 
  uploadFile(accessToken: string ) {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }
    
 
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const fileContent = fileReader.result as string;
      
      
      const encDataCipher = CryptoJS.AES.encrypt(fileContent, this.encryptionPassphrase)
      const encryptedFileContent = encDataCipher.toString();
      
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
  
      const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media';
  
    
      const blob = new Blob([encryptedFileContent], { type: 'text/plain' });
  
      this.http.post<any>(uploadUrl, blob, { headers }).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
       
          this.uploadedFileId = response.id;
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    };

    fileReader.readAsText(this.selectedFile);
  }

  downloadFile() {
  if (!this.googleApi.isLoggedIn()) {
    console.error('User not logged in.');
    return;
  }

  if (!this.googleApi.accessToken) {
    console.error('Access token not available.');
    return;
  }

  if (!this.uploadedFileId) {
    console.error('No file uploaded.');
    return;
  }

  this.googleApi.downloadFile(this.uploadedFileId).subscribe(encryptedFileContent => {
    const decryptedDataCipher = CryptoJS.AES.decrypt(encryptedFileContent, this.encryptionPassphrase);
    const decryptedData = decryptedDataCipher.toString(CryptoJS.enc.Utf8);
    console.log(decryptedData);
    const blob = new Blob([decryptedData], { type: this.selectedFile?.type ||  'application/octet-stream' }   ); 
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = this.selectedFile?.name || 'file'; 
    a.click();  
    window.URL.revokeObjectURL(url);
  });
}


  uploadSelectedFile() {
    if (!this.googleApi.isLoggedIn()) {
      console.error('User not logged in.');
      return;
    }

    if (!this.googleApi.accessToken) {
      console.error('Access token not available.');
      return;
    }

    this.uploadFile(this.googleApi.accessToken); 
  }
}