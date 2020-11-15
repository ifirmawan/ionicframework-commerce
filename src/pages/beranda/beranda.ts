import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { ApirestProvider } from '../../providers/apirest/apirest';
import { Storage } from '@ionic/storage';

import { SearchPage } from '../search/search';
import { DetailPage } from '../detail/detail';
import { MasukPage } from '../masuk/masuk';
/**
 * Generated class for the BerandaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-beranda',
  templateUrl: 'beranda.html',
})
export class BerandaPage {

	maintabkategori: any = 'beranda';
	CategorywithIco: any;
	allkategori: any[] = [];
	allbrand: any;
	allsubkat: any;

	allproduk: any[] = [];
	page: number = 1;
	limit: number = 15;

	allprodukbykategori: any;
	loadku: boolean = false;
	maintabaktif: any;

	deluxeproduk: any;
	popularproduk: any;

	adsall: any[] = [];

	user: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public platform: Platform,
		private api: ApirestProvider,
		private storage: Storage,
		private alert: AlertController
	) {

		this.platform = platform;

		this.CategorywithIco =[
							{ id: 'popular', name: 'POPULAR', ico: 'star-outline' },
							{ id: 'deluxe', name: 'DELUXE', ico: 'ios-appstore' },
							{ id: 2, name: 'ATAP INDOOR', ico: 'ios-arrow-up' },
							{ id: 3, name: 'ATAP OUTDOOR', ico: 'ios-arrow-down' },
							{ id: 4, name: 'BESI', ico: 'ios-color-wand-outline' },
							{ id: 5, name: 'CAT', ico: 'ios-color-fill-outline' },
							{ id: 6, name: 'GRANIT', ico: 'ios-information-circle-outline' },
							{ id: 7, name: 'KARBIT', ico: 'ios-flame-outline' }
						];
		this.getUser();

		this.appStartProduk();

	}

	appStartProduk() {
		this.storage.get('produk_all_beranda')
			.then(val => {
				if(val) {
					this.allproduk = val;
				} else {
					this.getAllProduk(this.page, this.limit);
				}
			}, err => {
				this.cekInternetKoneksi();
				console.log('Error appStart : error - ' + err);
			});
		this.storage.get('pages_beranda')
			.then(val => {
				if(val) {
					this.page = val;
				}
			}, err => {
				this.cekInternetKoneksi();
				console.log('Error appStart : error - ' + err);
			});

		this.getAllAds();

		this.getAllBrands();

		this.getAllKategori();

		this.getAllsubkategori();

		this.getDeluxandPopularProduk();
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

	getDeluxandPopularProduk() {
		this.storage.get('deluxeproduk').then(val => {
			if(val) {
				this.deluxeproduk = val;
			} else {
				this.api.getDeluxeProduk().then(val => {
					this.deluxeproduk = val;
					this.storage.set('deluxeproduk', this.deluxeproduk);


				}, err => {
					// this.cekInternetKoneksi();
					console.log('error load deluxe produk');
				});
			}
		}, err => {
			console.log('Beranda : Load Deluxe : error : ' + err);
		});

		this.storage.get('popularproduk').then(val => {
			if(val) {
				this.popularproduk = val;
			} else {
				this.api.getPopularProduk().then(val => {
					this.popularproduk = val;
					this.storage.set('popularproduk', this.popularproduk);


				}, err => {
					// this.cekInternetKoneksi();
					console.log('error load popular produk');
				});
			}
		}, err => {
			console.log('Beranda : Load Popular Product : error : ' + err);
		});
	}

	getAllKategori() {
		this.storage.get('allkategori').then(val => {
			if (val) {
				this.allkategori = val;
			} else {
				this.api.getAllKategori().then(val =>{
					let q: any = [];
					let s: number = 0;
					let arr: any[] = [];
					q = val;
					let w: number = q.length;
					let y: any = w/3;
					if(w%3 != 0) {
						y = y+1;
					}

					for(let x = 0; x < y; x++){
						for(let z = 0; z < 3; z++) {
							arr.push(q[s])
							s = s+1;
						}

						this.allkategori.push(arr);
						arr = [];
					}


					this.storage.set('allkategori', this.allkategori);



				}, err => {
					// this.cekInternetKoneksi();
					console.log('error load kategori');
				});
			}
		}, err => {
			console.log('allkategori');
		});
	}

	getAllsubkategori() {
		this.storage.get('allsubkategori').then(val => {
			if(val) {
				this.allsubkat = val;
				console.log('Beranda : Sudah ada sub kategori !');
			} else {
				this.api.getAllSubKategori().then(val => {
					this.storage.set('allsubkategori', val);
					this.allsubkat = val;
				}, err => {
					console.log('error : Beranda Page : Load Sub Kategori : ' + err);
				});
			}
		}, err => {

		});
	}

	getAllBrands() {
		this.storage.get('allbrands').then(val => {
			if(val) {
				this.allbrand = val;
				console.log('Beranda Page : Sukses Load AllBrands!');
			} else {
				this.api.getAllBrands().then(val => {
					this.storage.set('allbrands', val);
					this.allbrand = val;
				}, err => {
					console.log('error  : Beranda Page : Load All Brands : ' + err);
				});
			}
		}, err => {
			console.log("ALL BRANDS - can't load from local storage!");
		});
	}

	getAllAds() {
		this.api.getAllAds().then(val =>{
			this.adsall.push(val);
		}, err => {
			// this.cekInternetKoneksi();
			console.log('Error load Ads');
		});
	}

	getAllProduk(page: number, limit: number = this.limit){
		this.page = page;
		let div: any = this.user.id_divisi;
		
		this.api.getProductPaginate(page, div, limit).then(val => {
			let q: any = [];
			q = val;
			
			for(let x of q)  {
				this.allproduk.push(x);
			}
			this.storage.set('produk_all_beranda', this.allproduk);
			this.storage.set('pages_beranda', this.page)

		}, err => {
			// this.cekInternetKoneksi();
			console.log('Error load Produk');
		});
	}

	getProdukByKategori(id: any) {

		if(this.maintabaktif != id){ 

			this.maintabaktif = id;
			this.loadku = true;
			this.allprodukbykategori = 0;

			this.storage.get('produk_kat_' + id).then(val => {
				if (val) {
					this.allprodukbykategori = val;
					this.loadku = false;
				} else  {
					let div: any = this.user.id_divisi;
					
					this.api.getProductByKategori(id, div).then(val => {
						this.allprodukbykategori = val;

						this.storage.set('produk_kat_' + id, this.allprodukbykategori);

						this.loadku = false;

	

					}, err => {
						this.cekInternetKoneksi();
						console.log('error load data by kategori...')
					});
				}

			}, err => {
				console.log('Erro Storage Get : Produk_kat_' + id);
			});
		}
	}

	

	infiniteScroll(): Promise<any> {
		return new Promise((resolve) => {
			setTimeout(() => {
			  this.page++;
			  this.getAllProduk(this.page, this.limit);
			  resolve();
			},2000);
		});
	}

	funcRefresh(refresher) {
		this.alert.create({
			title: 'Informasi!',
			subTitle: 'Anda akan memuat ulang data lama di Beranda !',
			buttons: [{
				text: 'OK',
				handler: data => {
					
					for (let x of this.allkategori) {
						for (let y of x) {
							this.storage.remove('produk_kat_' + y.id_kategori);
						}
					}

					this.storage.remove('deluxeproduk');
					this.storage.remove('pages_beranda');
					this.storage.remove('popularproduk');
					this.storage.remove('produk_all_beranda');

					this.maintabkategori = 'beranda';
					this.allproduk = [];
					this.page = 1;
					this.allprodukbykategori = null;
					this.deluxeproduk = null;
					this.popularproduk = null;
					this.adsall = [];

					this.getAllAds();
					this.getAllProduk(this.page);
					this.getDeluxandPopularProduk();

					setTimeout(() => {
					  console.log('Async operation has ended');
					  refresher.complete();
					}, 2000);
				}
			}, {
				text: 'Batal',
				role: 'cancel',
				handler: data => {
					refresher.cancel();
				}
			}]
		}).present();
	}

	goToSearch() {
		this.navCtrl.push(SearchPage);
	}

	goToDetail(item) {
		this.navCtrl.push(DetailPage, {produk: item});
	}

	keTabsKategori(item: any) {
		this.maintabkategori = item;
		if(item != 'popular' && item != 'deluxe') {
			this.getProdukByKategori(item);
		}
	}

	cekInternetKoneksi() {
		this.alert.create({
			title: 'Koneksi Gagal!',
			subTitle: 'Pastikan anda terkoneksi jaringan data / wifi.',
			message: 'Tutup aplikasi dan priksa kembali koneksi jaringan perangkat anda!',
			buttons: [
				{
					text: 'OK',
					role: 'cancel'
				}
			]
		}).present();
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad BerandaPage');
	}

}
