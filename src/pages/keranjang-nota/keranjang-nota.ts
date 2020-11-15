import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ApirestProvider } from '../../providers/apirest/apirest';

/**
 * Generated class for the KeranjangNotaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-keranjang-nota',
  templateUrl: 'keranjang-nota.html',
})
export class KeranjangNotaPage {

  @ViewChild(SignaturePad) public signaturePad : SignaturePad;

  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200

  };
  
  public signatureImage : string;
  
  items: any;
  total: number;
  user: any;
  toko: any;

  count: number = 0;
  totalsblm: number = 0;
  diskoncash: number = 0;
  atasnama: string = '';
  downpayment: any;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alert: AlertController,
    private loading: LoadingController,
    private api: ApirestProvider,
    private toast: ToastController,
    private storage: Storage,
    private event: Events
  ) {
    this.items = this.navParams.data.item;
    this.total = this.navParams.data.total;
    this.user = this.navParams.data.user;
    this.toko = this.navParams.data.toko;
    // console.log(this.toko.nama);
    this.funcCountItems();
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    // console.log(canvas.offsetWidth);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);

    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  drawComplete() {

    this.signatureImage = this.signaturePad.toDataURL();

    // this
    //   .navCtrl
    //   .push(HomePage, {signatureImage: this.signatureImage});
  }

  drawClear() {
    this.signaturePad.clear();
  }

  drawCancel() {
    // this
    //   .navCtrl
    //   .push(HomePage);
   
  }

  funcCekSignaturImage(images: string) {
    if (this.signatureImage == 'data:image/png;base64,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') {
   
      return false;
   
    }  else {

      return true;
   
    }
  }

  funcCountItems() {
    let x: number = 0;
    let y: number = 0;

    for (let o of this.items) {
      x = x + Number(o.qty);
      y = y + (Number(o.harga) * Number(o.qty));
    }

    this.count = x;
    this.totalsblm = y;
    this.diskoncash = this.totalsblm - this.total;
    console.log(y);
  }

  funcProsesPesanan() {

    this.drawComplete();
    if (this.funcCekSignaturImage(this.signatureImage) && this.atasnama != '') {
      let loader = this.loading.create({
        content: 'Sedang Proses...',
        spinner: 'crescent'
      });
      
      this.alert.create({
        title: 'Masukan PIN Anda!',
        inputs: [
          {
            name: 'pin',
            type: 'number',
            placeholder: 'PIN SALES'
          }
        ],
        buttons: [
          {
            text: 'Proses Pesanan',
            handler: data => {
              let pin : any = data.pin;
              
              let pemesanan: any = {
                kode_toko : this.toko.kode,
                kode_user : this.user.kode,
                total_bayar : this.total,
                ttd : String(this.signatureImage),
                atas_nama : this.atasnama
              };
        
              let detail: any = this.items;
              let dp: number = 0;
              if (this.downpayment == '') {
                dp = 0;
              } else {
                dp = Number(this.downpayment);
              }

              loader.present();
        
              this.api.postPemesananBarang(pemesanan, detail, dp, pin).then(val => {
                if (val['error']) {
                  this.toast.create({
                    message: val['error'],
                    position: 'midle',
                    duration: 3000
                  }).present();
                } else {
                  this.toast.create({
                    message: val['error'],
                    position: 'midle',
                    duration: 3000
                  }).present();

                  this.funcUpdateCart();

                  this.navCtrl.popToRoot();
                }
                loader.dismiss();
              }, err => {
                console.log('Error', err);
                loader.dismiss();
              });

            }
          }
        ]
      }).present();

    } else {
      this.alert.create({
        title: 'Tanda Tangan Harus Di Isi, Beserta Atas Nama!',
        subTitle: 'Pastikan pemilik toko atau yang mewakili untuk menandatangani nota.',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      }).present();
    }
  }

  funcUpdateCart() {
    this.storage.get('cart_nbm').then(val => {
      if (val) {
        let x: any[] = [];
        let y: any[] = [];
        x = val;

        for (let o of this.items) {
          // let xx = x.filter((item) => {
          //   return (item.id_barang.indexOf(o.id_barang) > -1);
          // });
          for (let r of x) {
            if (r.id_barang == o.id_barang) {
              let index = x.indexOf(r);
              x.splice(index, 1);
            }
          }
        }

        if (x.length != 0) {
          this.event.publish('cart:update', x.length);
          this.storage.remove('cart_nbm');
          this.storage.set('cart_nbm', x);
        } else {
          this.event.publish('cart:update', 0);
          this.storage.remove('cart_nbm');
        }
        
      } else {
        this.storage.remove('cart_nbm');
      }
    }, err => {
      console.log('Error Storage', err);
    });
  }

  ngAfterViewInit() {
    // console.log("Reset Model Screen");
    this.signaturePad.clear();
    this.canvasResize();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KeranjangNotaPage');
  }

}
