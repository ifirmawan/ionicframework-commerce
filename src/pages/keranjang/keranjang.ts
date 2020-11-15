import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SearchPage } from '../search/search';
import { KeranjangTokoPage } from '../keranjang-toko/keranjang-toko';
/**
 * Generated class for the KeranjangPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-keranjang',
  templateUrl: 'keranjang.html',
})
export class KeranjangPage {

	items: any;
	count: number = 0;
	checkall: boolean = true;
	total: number = 0;
	status: boolean = false;

  	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private storage: Storage,
		public platform: Platform,
		private alert: AlertController,
		private event: Events,
		private cdr: ChangeDetectorRef)
  	{
  		// this.getItemsCart();
	}

	getItemsCart() {
		this.count = 0;
		this.total = 0;
		this.checkall = true;

		this.storage.get('cart_nbm').then(val => {
			if(val) {
				let x: any[] = [];

				for (let o of val) {
					o.checked = true;
					this.count = Number(this.count) + Number(o.qty);
					this.total = Number(this.total) + Number(o.total);
					x.push(o);
				}

				this.items = x;

			} else {
				this.storage.remove('cart_nbm');
				this.items = 0;
			}
		}, err => {
			console.log('Error Storage ?', err);
			this.items = 0;
		});
	}

	funcCheked(index, isChecked) {
		this.items[index].checked = isChecked;
		this.funcCekCheckAll();
	}

	funcCheckAll() {
		let isChecked: boolean = this.checkall;

		if (isChecked) {
			this.checkall = false;
			for (let o in this.items) {
				this.items[o].checked = false;
			}
		} else  {
			this.checkall = true;
			for (let o in this.items) {
				this.items[o].checked = true;
			}
		}

		this.cdr.detectChanges();
	}

	funcCekCheckAll() {
		let x: number = 0;

		for (let o of this.items) {
			if (!o.checked) {
				x = x + 1;
			}
		}

		if (x > 0) {
			this.checkall = false;
		} else {
			this.checkall = true;
		}

		this.funcCountItems();
	}

	funcCountItems() {
		if(typeof this.items === 'object') {
			let i: number = 0;
			let t: number = 0;
			for (let o of this.items) {
				if (o.checked) {
					i = i + Number(o.qty);
					t = t + Number(o.total);
				}
			}
			
			this.count = i;
			this.total = t;
		}
	}

	funcChangeQty(index: any, value: any = 1) {
		
		this.storage.get('cart_nbm').then(val => {
			if (val) {
				let x: any[] = [];
				let qut: number = 1;
				let harga: number = this.items[index].harga;
				let diskonopt: number = this.items[index].diskon_opt;
				let diskonspc: number = this.items[index].diskon_spc;

				x = val;

				if (value == "" || value == 0) {
					qut = 1;
				} else {
					if (Number(value) > this.items[index].min_jual) {
						diskonspc = this.items[index].cash_discount;
					} else {
						diskonspc = 0;
					}
		
					qut = Number(value);
				}
		
				this.items[index].qty = qut;
				this.items[index].diskon_spc = diskonspc;

				x[index].qty = qut;
				x[index].diskon_spc = diskonspc;

				let hargadiskonopt: number;
				let hargadiskonspc: number;
				let hargaawal: number = harga * qut;
				let diskon1: any = diskonopt / 100;
				let diskon2: any = diskonspc / 100;

				if(diskon1 != 0) {
					hargadiskonopt = hargaawal - Math.round(hargaawal * diskon1);
				} else {
					hargadiskonopt = hargaawal;
				}

				if(diskon2 != 0){	
					hargadiskonspc = hargadiskonopt - Math.round(hargadiskonopt * diskon2);
				} else {
					hargadiskonspc = hargadiskonopt;
				}

				this.items[index].total = Math.round(hargadiskonspc);
				x[index].total = Math.round(hargadiskonspc);

				this.storage.remove('cart_nbm');
				this.storage.set('cart_nbm', x);

				this.funcCountItems();
				
			} else {
				this.storage.remove('cart_nbm');
				this.items = 0;
			}
		}, err => {
			console.log('Error Keranjang!', err);
			this.items = 0;
		});
	}

	funcDeleteCart(index: any) {
		let al = this.alert.create({
			title: 'Hapus Barang Dari Keranjang.',
			subTitle: 'Anda yakin ingin menghapus ' + this.items[index].nama,
			buttons: [
				{
					text: 'Hapus',
					handler: data => {
						this.storage.get('cart_nbm').then(val => {
							let x: any[] = [];
							x = val;

							x.splice(index, 1);
							this.storage.set('cart_nbm', x);
							this.items.splice(index, 1);

							this.event.publish('cart:update', x.length);
							this.funcCountItems();
						}, err => {
							this.alert.create({
								title: 'Gagal Hapus!',
								buttons: [{
									text: 'OK',
									role: 'cancel'
								}]
							}).present();
						});
					}
				}
			]
		});

		al.present();
	}

	goToPilihToko() {
		let item: any[] = [];
		let total: number = 0;
		let q: number = 0;

		for (let x of this.items) {
			if (x.checked) {
				item.push(x);
				total = total + Number(x.total);
				// cuma buat cek
				q = q + 1;
			}
		}
		// console.log(q);
		if (q > 0) {
			this.navCtrl.push(KeranjangTokoPage, {item: item, total: total});	
		} else {
			this.alert.create({
				title: 'Tidak ada barang terpilih!',
				message: 'Pastikan anda memilih barang yang ingin dibeli.',
				buttons: [
					{
						text: 'OK',
						role: 'cancel'
					}
				]
			}).present();
		}
	}

	goToSearch() {
		this.navCtrl.push(SearchPage);
	}

	ionViewDidEnter() {
		//if (this.status) {
			this.getItemsCart();
		//}
	}
	
	ionViewDidLoad() {
		// this.status = true;
	}

}
