import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ApirestProvider } from '../../providers/apirest/apirest';
import { Storage } from '@ionic/storage';

import { MasukPage } from '../masuk/masuk';
import { KeranjangNotaPage } from '../keranjang-nota/keranjang-nota';
/**
 * Generated class for the KeranjangTokoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-keranjang-toko',
  templateUrl: 'keranjang-toko.html',
})
export class KeranjangTokoPage {

  user: any = false;
  items: any = 0;
  loader: boolean = false;

  item: any;
  total: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApirestProvider,
    private storage: Storage,
    private alert: AlertController
    ) 
  {
    this.item = this.navParams.data.item;
    this.total = this.navParams.data.total;
    
    this.getAllToko();    
  }
  
  getAllToko() {
    let iduser: any = 15;
    
    this.storage.get('login_profile')
			.then(val => {
				if (val) {
          iduser = val.id_user;
          this.user = val;

          this.storage.get('alltoko').then(val => {
            if (val && val != 0) {
              this.items = val;
            } else {
              this.storage.remove('alltoko');

              this.api.getAllToko(iduser).then(val => {
                if (val) {
                  this.items = val;
                  this.storage.set('alltoko', val);
                } else {
                  this.items = 0;
                }
              }, err => {
                this.alert.create({
                  title: 'Kesalahan Aplikasi!',
                  subTitle: 'Pastikan Koneksi Internet.',
                  message: 'Tutup dan Buka kembali aplikasi anda.',
                  buttons: [
                    {
                      text: 'OK',
                      role: 'cancel'
                    }
                  ]
                }).present();
              });
            }
          }, err => {
            this.alert.create({
              title: 'Kesalahan Aplikasi!',
              subTitle: 'Aplikasi mengalami masalah.',
              message: 'Harap Tutup dan Buka kembali aplikasi, bila masih mengalami masalah, copot dan pasang kembali aplikasi!',
              buttons:[{
                text: 'OK',
                role: 'cancel'
              }]
            }).present();
          });
				} else {
					this.storage.remove('login_profile');
					this.navCtrl.setRoot(MasukPage);
				}
			}, err => {
				this.alert.create({
					title: 'Peringatan!',
					subTitle: 'Aplikasi mengalami masalah.',
					message: 'Harap Tutup dan Buka kembali aplikasi, bila masih mengalami masalah, copot dan pasang kembali aplikasi!',
					buttons:[{
						text: 'OK',
						role: 'cancel'
					}]
				}).present();
      });
  }

  getItems(ev) {
		// set val to the value of the searchbar
      let val = ev.target.value;
      // this.getAllToko();

	    // if the value is an empty string don't filter the items
	    if (val && val.trim() != '') {
        if (typeof val === 'string') {
          val = val.toLowerCase();
        }
        this.loader = true;
	    	this.items = this.items.filter((item) => {
          return (item.nama.toLowerCase().indexOf(val) > -1);
        });
        this.loader = false;
	    } else {
        this.getAllToko();
	    	this.loader = false;
	    }

  }
  
  funcRefresher(refresh) {
    this.storage.remove('alltoko');
    this.getAllToko();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresh.complete();
    }, 2000);
  }

  funcPilihToko(index: any) {
    this.navCtrl.push(KeranjangNotaPage, {item: this.item, total: this.total, user: this.user, toko: this.items[index]});
  }

  // ionViewDidEnter() {
    
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KeranjangTokoPage');
  }

}
