import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import { ApirestProvider } from '../../providers/apirest/apirest';
import { Storage } from '@ionic/storage';

import { MasukPage } from '../masuk/masuk';
import { DetailPage } from '../detail/detail';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

	history: any[] = [];
	loader: boolean = false;
	items: any;
	user: any;
	query: string = '';

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		private actionsheetctrl: ActionSheetController, 
		private api: ApirestProvider,
		private storage: Storage,
		private alert: AlertController
	) {

		this.getHistorySearch();
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
						role: 'cancle'
					}]
				}).present();
			});
	}

	getItems(ev) {
		// set val to the value of the searchbar
	    let val = ev.target.value;

	    // if the value is an empty string don't filter the items
	    if (val && val.trim() != '' && val.length > 2) {
	    	val = val.toLowerCase();
	    	this.loader = true;
	    	this.history = [];
	    	this.items = 0;

	    	this.api.getProductByKeywords(val, 0, 10, this.user.id_divisi)
	    		.then(value => {
	    			if(value && value != 0) {
	    				this.items = value ;
	    				this.loader = false;
	    				console.log(this.items);
	    			} else {
	    				this.items = 'kosong';
	    				this.loader = false;
	    			}
	    		}, err => {
	    			console.log('Error Search Page : ' + err);
	    		});
	    } else {
	    	this.getHistorySearch();
	    	this.loader = false;
	    }

	}

	getHistorySearch() {
		this.items = 0;

		this.storage.get('history_search')
			.then(val => {
				if(val) {
					this.history = val;
				} else {
					this.history = [];
				}
			}, err => {
				console.log('Error Get Storage : Search!');
			});
	}

	goToDetail(item: any) {
		this.navCtrl.push(DetailPage, {produk: item});
	}

	funcToDetails(item: any) {
		this.storage.get('history_search')
			.then(val => {
				if(val) {
					let count = val.length;
					this.history = val;
					if (count > 5) {
						this.history.push(item);
						this.history.splice(0, 1);
						this.storage.set('history_search', this.history);
					} else {
						this.history.push(item);
						this.storage.set('history_search', this.history);
					}

				} else {
					this.history.push(item);
					this.storage.set('history_search', this.history);
				}
			});

		this.navCtrl.push(DetailPage, { produk : item });
		this.history = [];
	}
	
	funcHighLight(text: string = '') {
		if(typeof text === 'string') {
            return text.replace(new RegExp(this.query, "gi"), match => {
	            return '<span class="highlightText">' + match + '</span>';
	        });
        }
	}

	funcButtonMore() {
		let actionsheet = this.actionsheetctrl.create({
			title: 'Pengaturan Pencarain',
			buttons: [
	  		{
	  			text: 'Hapus Riwayat Pencarain',
	  			handler: () => {
	  				this.storage.remove('history_search');
	  				this.history = [];
	  			}
	  		},
	  		{
	  			text: 'Batal',
	  			role: 'cancel'
	  		}
			]
		});

		actionsheet.present();
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad SearchPage');
	}

}
