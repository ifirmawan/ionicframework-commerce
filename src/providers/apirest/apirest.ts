// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
/*
  thanks to :
  =======================================================
  *  ___  _ ___ _   _ ____ _____  ___  ___  _ __  _ __  *
  * / _ \| '_  | | | |  __|_   _|/ __// _ \| '__|| '_ \ *
  *| (_) | | | | |_| |  __| | | | (__| (_) | |   | |_| |*
  * \___/|_| |_|\__, |____| |_|  \___\\___/|_|   |  __/ *
  *             |___/                            |_|    *
  =======================================================

*/
@Injectable()
export class ApirestProvider {

	apiUrl: string = 'http://nbm-pt.com/';

	constructor(public http: Http) {
		console.log('Hello ApirestProvider Provider');
	}

	// popular item here
	getPopularProduk() {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/product/get_popular_product')
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getDeluxeProduk() {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/product/get_deluxe')
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getPopularBrands() {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/product/get_popular_brands')
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	// Produk API
	getallProduct(div: any = 0) {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/sxjd/get_all/' + div)
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getProductPaginate(page: number = 1, div: any = 0, limit: number = 15) {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/sxjd/get_all_pagination/' + page + '/' + div + '/' + limit)
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getProductByKategori(id: any = 1, div: any = 0) {
		return new Promise((resolve, reject) => {
		  	this.http.get(this.apiUrl + 'api/index.php/sxjd/get_all_bykat/' + id + '/' + div)
			    .subscribe(res => {
			      resolve(res.json());
			    }, (err) => {
			      reject(err);
			    });
		});
	}

	getProductByKategoriPagination(page: number = 1, id: any = 1, div: any = 0, limit: number = 15) {
		return new Promise((resolve, reject) => {
		  	this.http.get(this.apiUrl + 'api/index.php/sxjd/get_all_bykatpage/' + page + '/' + id + '/' + div + '/' + limit)
			    .subscribe(res => {
			      resolve(res.json());
			    }, (err) => {
			      reject(err);
			    });
		});
	}

	getProductBySubkategori(sub_kat: any = '') {
		return new Promise((resolve, reject) => {
		  	this.http.get(this.apiUrl + 'api/index.php/sxjd/get_all_bysubkat/' + sub_kat)
			    .subscribe(res => {
			      resolve(res.json());
			    }, (err) => {
			      reject(err);
			    });
		});
	}

	getProdukByBrand(id: any) {
		return new Promise((resolve, reject) => {
			this.http.get(this.apiUrl + 'api/index.php/product/get_by_brand/' + id)
				.subscribe(res => {
					resolve(res.json());
				}, (err) => {
					reject(err);
				});
		});
	}

	getProductByKeywords(key: string = '', start: number = 0, length: number = 10, div: any = 0) {
		let body = JSON.stringify({
			key: key
		});

		return new Promise((resolve, reject) => {
		this.http.post(this.apiUrl + 'api/index.php/product/search/' + start + '/' + length + '/' + div, body)
			.subscribe(res => {
				resolve(res.json());
				// console.log(res);
			}, (err) => {
			  	reject(err);
			});
		});
	}

	getDetailProduk(id: any = 1) {
		return new Promise((resolve, reject) => {
			this.http.get(this.apiUrl + 'api/index.php/sxjd/get_detail_item/' + id)
				.subscribe(res => {
					resolve(res.json());
				}, err => {
					reject('Error API Connections : ' + err);
				})
		});
	}

	// Brands & Ads API
	getAllBrands() {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/product/get_all_brands')
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getAllAds() {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/product/get_all_ads')
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	// Kateogri & Sub Kategori API
	getAllKategori() {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/product/get_all_categories')
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getAllSubKategori() {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/product/get_all_sub_categories')
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	// Wilayah API
	getProvinsiAll() {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/sxjd/get_profinsi')
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getKabupatenByProvinsi(id: any = 1) {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/sxjd/get_kabupaten/' + id)
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getKecamatanByKabupaten(id: any = 1101) {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/sxjd/get_kecamatan/' + id)
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	getKelurahanByKecamatan(id: any = 110101) {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/sxjd/get_kelurahan/' + id)
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	// Toko, mari masuk ke toko
	getAllToko(user: any = 1) {
		return new Promise((resolve, reject) => {
		  this.http.get(this.apiUrl + 'api/index.php/sxjd/get_all_toko_byuser/' + user)
		    .subscribe(res => {
		      resolve(res.json());
		    }, (err) => {
		      reject(err);
		    });
		});
	}

	// Pemesanan Barang
	postPemesananBarang(pemesanan: any, detail: any, dp: number, pin: any) {

		let body = JSON.stringify({
			pemesanan: pemesanan,
			detail: detail,
			dp: dp,
			pin: pin
		});

		return new Promise((resolve, reject) => {
		this.http.post(this.apiUrl + 'api/index.php/sxjd/post_pemesanan', body)
			.subscribe(res => {
				resolve(res.json());
				console.log(res);
			}, (err) => {
			  	reject(err);
			});
		});
	}

	// User Auth
	authLogin(user: string, pass: string) {
		// let headers = new Headers({
		// 	'Content-Type' : 'application/json'
		// });

		// let options = new RequestOptions({
		// 	headers : headers
		// });

		let body = JSON.stringify({
			username: user,
			password: pass
		});

		return new Promise((resolve, reject) => {
		this.http.post(this.apiUrl + 'api/index.php/user/login', body)
			.subscribe(res => {
				resolve(res.json());
				console.log(res);
			}, (err) => {
			  	reject(err);
			});
		});
	}

}
