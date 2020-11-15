import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { TabsPage } from '../pages/tabs/tabs';
import { MasukPage } from '../pages/masuk/masuk';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
  private platform: Platform, 
  statusBar: StatusBar, 
  splashScreen: SplashScreen,
  private alert: AlertController,
  private storage: Storage,
  private permission: AndroidPermissions) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.addPermission();
      this.cekLogin();
    });
  }

  addPermission() {
      if (this.platform.is('android')) {
          this.permission.requestPermissions(
              [
                  this.permission.PERMISSION.CAMERA,
                  this.permission.PERMISSION.CALL_PHONE,
                  this.permission.PERMISSION.GET_ACCOUNTS,
                  this.permission.PERMISSION.LOCATION_HARDWARE,
                  this.permission.PERMISSION.ACCESS_COARSE_LOCATION,
                  this.permission.PERMISSION.ACCESS_FINE_LOCATION,
                  this.permission.PERMISSION.INTERNET,
                  this.permission.PERMISSION.SEND_SMS
              ]
          );
      }
  }

  cekLogin() {
      this.storage.get('login_status').then(val => {
        if (val === 'loggined') {
          this.storage.get('login_profile').then(val => {
            if(val != 0) {
              this.rootPage = TabsPage;
            } else {
              this.rootPage = MasukPage;
            }
          });
        } else {
          this.rootPage = MasukPage;
        }
      }, err => {
        this.alert.create({
          title: 'Error Koneksi ke Storage!',
          subTitle: 'Gagal masuk ke aplikasi.',
          buttons: [
          {
            text: 'OK'
          }]
        })
      });
    }
}
