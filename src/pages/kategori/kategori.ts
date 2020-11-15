import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { ApirestProvider } from '../../providers/apirest/apirest';
import { Storage } from '@ionic/storage';

import { SearchPage } from '../search/search';
import { MasukPage } from '../masuk/masuk';
import { DetailPage } from '../detail/detail';
/**
 * Generated class for the KategoriPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-kategori',
  templateUrl: 'kategori.html',
})
export class KategoriPage {
	allkategori: any[] = [];
	allbrands: any[] = [];
	allsubkategori: any[] = [];
	selectedkat: any = 'popular';

	popularbrands: any[] = [];

	// for function
	funcbrands : any[] = [];
	user: any;
	loader: boolean = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private storage: Storage,
		private api: ApirestProvider,
		public platform: Platform,
		private alert: AlertController
	) {
		this.platform = platform;
		this.getAllKategori();
		this.getAllsubkategori();
		this.getAllBrands();
		this.getUser();
	}

	getUser() {
		this.storage.get('login_profile')
			.then(val => {
				if (val) {
					this.user = val;
					console.log(this.user.id_divisi);
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

	// popular brand
	getPopularBrands() {
		this.popularbrands = [];
		this.api.getPopularBrands().then(val => {
			this.popularbrands.push(val);
		}, err => {
			console.log('Kategori Page : Erro Load : Erro Popular Brands : error - ' + err);
		});
	}

	// Function
	getProdukByKategori(id: any) {

		this.getAllsubkategori()

		this.funcbrands = [];

		this.loader = true;

		let x: number = 0;

		for (let o of this.allsubkategori) {
			if (o.id_kategori === id) {
				x = 1;
			}
		}

		if (x != 0) {
			this.storage.get('produk_kat_' + id).then(val => {
				if (val) {
					let produk: any[] = [];
					produk = val;

					for (let x of this.allsubkategori) {
						if (x.id_kategori === id) {
							let data: any[] = [];
							let sub: string = x.nama;

							sub = sub.toLowerCase();

							for (let y of produk) {
								let sub_p: string = y.sub_kategori;
								sub_p = sub_p.toLowerCase();

								if(sub === sub_p) {
									data.push(y);
								}
							}

							this.funcbrands.push({ id: x.id_sub_kategori, nama: x.nama, data: data });
						}
					}

					this.loader = false;
				} else  {
					let div: any = this.user.id_divisi;
					
					this.api.getProductByKategori(id, div).then(val => {
						let produk: any = 0;
						produk = val;
						this.storage.set('produk_kat_' + id, produk);

						for (let x of this.allsubkategori) {
							if (x.id_kategori === id) {
								let data: any[] = [];
								let sub: string = x.nama;

								sub = sub.toLowerCase();

								for (let y of produk) {
									let sub_p: string = y.sub_kategori;
									sub_p = sub_p.toLowerCase();

									if(sub === sub_p) {
										data.push(y);
									}
								}

								this.funcbrands.push({ id: x.id_sub_kategori, nama: x.nama, data: data });
							}
						}

						this.loader = false;
					}, err => {
						this.loader = false;

						this.alert.create({
							title: 'Kesalahan!',
							subTitle: 'Kesalahan Pada Koneksi!',
							message: 'Error : ' + err,
							buttons: [{
								text: 'OK',
								role: 'cancel'
							}]
						}).present();
					});
				}

			}, err => {
				console.log('Erro Storage Get : Produk_kat_' + id);
			});
		} else {

			this.loader = false;
		
		}
	}
	// Database API
	getAllKategori() {
		this.storage.get('allkategori').then(val => {
			if(val) {
				for(let a of val) {
					for(let b of a) {
						this.allkategori.push(b);
					}
				}
			} else {
				this.api.getAllKategori().then(val => {
					this.allkategori.push(val);
				}, err => {
					console.log('error : Kategori Page : Load Kategori : ' + err);
				});
			}
		}, err => {
			console.log("ALLKATEGORI - can't load from local storage!");
		});
	}

	getAllsubkategori() {
		this.storage.get('allsubkategori').then(val => {
			if(val) {
				this.allsubkategori = val;
			} else {
				this.api.getAllSubKategori().then(val => {
					this.allsubkategori.push(val);
					this.storage.set('allsubkategori', val);
				}, err => {
					console.log('error : Kategori Page : Load Sub Kategori : ' + err);
				});
			}
		}, err => {

		});
	}

	getAllBrands() {
		this.storage.get('allbrands').then(val => {
			if(val) {
				this.allbrands = val;
			} else {
				this.api.getAllBrands().then(val => {
					this.allbrands.push(val);
					this.storage.set('allbrands', val);
				}, err => {
					console.log('error  : Kategori Page : Load All Brands : ' + err);
				});
			}
		}, err => {
			console.log("ALL BRANDS - can't load from local storage!");
		});
	}

	goToSearch() {
		this.navCtrl.push(SearchPage);
	}

	goToDetail(item: any) {
		this.navCtrl.push(DetailPage, {produk: item});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KategoriPage');
	}

}
