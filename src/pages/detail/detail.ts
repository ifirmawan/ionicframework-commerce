import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ApirestProvider } from '../../providers/apirest/apirest';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

	item: any[] = [];
	detailitem: any;
	harga: number;
	hargaasli: number;
	hargaasli2: number;
	quantitas: number = 1;

	diskonopt: number = 0;
	diskonspc: number = 0;
	cashdiskonopt: number = 0;
	cashdiskonspc: number = 0;


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private storage: Storage,
		private toast: ToastController,
		public events: Events,
		private cdr: ChangeDetectorRef,
		private alertctrl: AlertController,
		private api: ApirestProvider
	) {
		this.detailitem = this.navParams.data.produk;
		this.harga = this.navParams.data.produk.harga;
		this.hargaasli = this.navParams.data.produk.harga;
	}

	getItemDetails(refresh) {
		let id = this.detailitem.id_barang;

		this.api.getDetailProduk(id).then(val => {

			let o: any;
			o = val;

			for (let x of o) {
				this.detailitem = x;
			}

			this.harga = this.detailitem.harga;
			this.hargaasli = this.detailitem.harga;

			setTimeout(() => {
			  console.log('Async operation has ended');
			  refresh.complete();
			}, 2000);

		}, err => {

			this.alertctrl.create({
				title: 'Kesalahan!',
				subTitle: 'Kesalahan pada koneksi ke server!',
				message: 'Priksa kembali koneksi internet anda, tutup dan buka kembali aplikasi!',
				buttons: [{
					text: 'OK',
					role: 'cancel',
					handler: data => {
						refresh.cancel();
					}
				}]
			}).present();

		});
	}

	batalButton() {
		this.navCtrl.pop();
	}

	qtyInput(ev: any) {
		let val = ev.target.value;

		if (this.quantitas == 0 || val == 0 || val == '') {
			this.quantitas = 1;
			this.funcMathSum(val);
		} else {
			this.quantitas = val;
			this.funcMathSum(val);
			// this.harga = this.detailitem.harga * val;
		}

		this.funcCekDiskonSpc();

		this.cdr.detectChanges();
	}

	buttonPlus(){
		let x = Number(this.quantitas.valueOf()) + 1;
		this.quantitas = x;
		this.funcMathSum(this.quantitas);
		this.funcCekDiskonSpc();
		// this.harga = this.quantitas * this.detailitem.harga;
		this.cdr.detectChanges();
	}

	buttonMinus(){
		if (this.quantitas > 1) {
			this.quantitas = Number(this.quantitas - 1);
		}

		this.funcMathSum(this.quantitas);
		this.funcCekDiskonSpc();
		// this.harga = this.quantitas * this.detailitem.harga;
		this.cdr.detectChanges();
	}

	buttonKeKeranjang() {

		this.storage.get('cart_nbm').then((val) => {
			if(val) {
				
				let ix: any[] = [];
				let itemyg: any = false;

				ix = val;

				for(let i of ix) {
					if(i.id_barang == this.detailitem.id_barang) {
						// this.quantitas = Number(this.quantitas) + Number(i.qty);
						itemyg = i;
					}
				}

				if (itemyg) {
					let index = ix.indexOf(itemyg);
					let qty: number = this.quantitas;
					ix.splice(index, 1);
					if (this.diskonopt == 0 && itemyg.diskon_opt != 0) {
						this.diskonopt = itemyg.diskon_opt;
					}
					this.quantitas = Number(qty) + Number(itemyg.qty);						
					this.cdr.detectChanges();
				}

				this.funcCekDiskonSpc();
				this.funcMathSum(this.quantitas);

				this.detailitem.diskon_opt = this.diskonopt;
				this.detailitem.diskon_spc = this.diskonspc;
				this.detailitem.total = this.harga;
				this.detailitem.qty = this.quantitas;

				ix.push(this.detailitem);

				this.storage.remove('cart_nbm');
				this.storage.set('cart_nbm', ix);

				this.events.publish('cart:update', ix.length);
				
			} else {
				this.detailitem.diskon_opt = this.diskonopt;
				this.detailitem.diskon_spc = this.diskonspc;
				this.detailitem.total = this.harga;
				this.detailitem.qty = this.quantitas;

				let ix: any[] = [];
				ix.push(this.detailitem);

				this.storage.set('cart_nbm', ix);

				this.events.publish('cart:update', ix.length);
			}

			// this.item.push({
			// 	id: this.detailitem.id, name: this.detailitem.name, image: this.detailitem.image, totalharga: Number(this.quantitas) * Number(this.detailitem.price), qty: this.quantitas, price: this.detailitem.price
			// });

			// this.storage.set('cart', this.item);
		});

		this.toast.create({
			message: 'Barang berhasil di tambahkan!',
			duration: 1000,
			position: 'top'
		}).present();

		this.navCtrl.pop();

	}

	funcCekDiskonSpc() {
		if(this.quantitas > this.detailitem.min_jual) {
			this.diskonspc = this.detailitem.cash_discount;
		} else if(this.quantitas <= this.detailitem.min_jual) {
			this.diskonspc = 0;
		}

		this.funcMathSum(this.quantitas);
	}

	funcMathSum(val: number) {
		let hargadiskonopt: number;
		let hargadiskonspc: number;
		let hargaawal: number = this.detailitem.harga * val;
		let diskon1: any = this.diskonopt / 100;
		let diskon2: any = this.diskonspc / 100;

		if(diskon1 != 0) {
			hargadiskonopt = hargaawal - Math.round(hargaawal * diskon1);
			this.cashdiskonopt = Math.round(hargaawal * diskon1);
		} else {
			hargadiskonopt = hargaawal;
		}

		if(diskon2 != 0){	
			hargadiskonspc = hargadiskonopt - Math.round(hargadiskonopt * diskon2);
			this.cashdiskonspc = Math.round(hargadiskonopt * diskon2);
		} else {
			hargadiskonspc = hargadiskonopt;
		}

		this.harga = Math.round(hargadiskonspc);
	}

	funcDiskonOptional() {

		let alertcek = this.alertctrl.create({
			title: 'Diskon Optional!',
			subTitle: 'Masukan Diskon tanpa tanda persen %, Maksimal 99',
			inputs: [
				{
					name: 'diskonopt',
					type: 'number',
					placeholder: 'Diskon Optional'
				}
			],
			buttons: [
				{
					text: 'Diskon',
					handler: data => {
						let dataku = data.diskonopt;
						if(dataku > 99 || dataku == 0) {
							this.toast.create({
								message: 'Gagal Tambah Diskon!',
								duration: 5000,
								position: 'top'
							}).present();
						} else {
							this.toast.create({
								message: 'Berhasil Set Diskon!',
								duration: 5000,
								position: 'top'
							}).present();

							this.diskonopt = dataku;

							this.funcMathSum(this.quantitas);
						}
					}
				}
			]
		});

		this.storage.get('cart_nbm').then(val => {
			if (val) {

				let it: any[] = [];
				let q: any = 0;

				it = val;

				for (let x of it) {
					if(x.id_barang == this.detailitem.id_barang) {
						q = x;
					}
				}

				if (q == 0) {
					alertcek.present();
				} else {
					if (q.diskon_opt != 0) {
						this.alertctrl.create({
							title: 'Diskon Optional untuk barang ini sudah ada di keranjang senilai ' + q.diskon_opt + '%',
							subTitle: 'Apakah anda ingin mengganti Diskon Optional lama dengan yang baru ?',
							buttons: [
								{
									text: 'Ganti Diskon',
									handler: data => {
										alertcek.present();
									}
								},
								{
									text: 'Gunakan Diskon Lama',
									handler: data => {
										this.diskonopt = q.diskon_opt;
										this.funcMathSum(this.quantitas);
									}
								}
							]
						}).present();
					} else {
						alertcek.present();
					}
				}

			} else  {

				alertcek.present();

			}

		}, err => {

			alertcek.present();
		
		});
	}

	funcDiskonOptionalClear() {
		this.diskonopt = 0;

		this.funcMathSum(this.quantitas);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DetailPage');
	}

}
