import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MasukPage } from '../pages/masuk/masuk';
import { BerandaPage } from '../pages/beranda/beranda';
import { KategoriPage } from '../pages/kategori/kategori';
import { KeranjangPage } from '../pages/keranjang/keranjang';
import { KeranjangDetailPage } from '../pages/keranjang-detail/keranjang-detail';
import { KeranjangNotaPage } from '../pages/keranjang-nota/keranjang-nota';
import { KeranjangTokoPage } from '../pages/keranjang-toko/keranjang-toko';
import { SalesPage } from '../pages/sales/sales';
import { TokoPage } from '../pages/toko/toko';
import { SearchPage } from '../pages/search/search';
import { DetailPage } from '../pages/detail/detail';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApirestProvider } from '../providers/apirest/apirest';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MasukPage,
    BerandaPage,
    KategoriPage,
    KeranjangPage,
    KeranjangNotaPage,
    KeranjangDetailPage,
    KeranjangTokoPage,
    SalesPage,
    TokoPage,
    SearchPage,
    DetailPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'bottom',tabsHideOnSubPages: true}),
    IonicStorageModule.forRoot({
      name: '_ptnbm',
         driverOrder: ['sqlite', 'indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MasukPage,
    BerandaPage,
    KategoriPage,
    KeranjangPage,
    KeranjangNotaPage,
    KeranjangDetailPage,
    KeranjangTokoPage,
    SalesPage,
    TokoPage,
    SearchPage,
    DetailPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApirestProvider,
    AndroidPermissions
  ]
})
export class AppModule {}
