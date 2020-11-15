import { Component } from '@angular/core';
import { AlertController, NavController, ToastController, LoadingController } from 'ionic-angular';

import { ApirestProvider } from '../../providers/apirest/apirest';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the MasukPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-masuk',
  templateUrl: 'masuk.html',
})
export class MasukPage {
	password: string = '';
  	username: string = '';
  	matanbm: boolean = false;
	constructor(
		private loadingctrl: LoadingController, 
		private toast: ToastController, 
		private alertCtrl: AlertController, 
		public nav: NavController, 
		private api: ApirestProvider, 
		private storage: Storage) {
		this.alertCtrl = alertCtrl;
	}

	funcSubmitLogin() {
		let loader = this.loadingctrl.create({
			content: 'Sedang Proses...',
			spinner: 'crescent'
		});

		loader.present();

		this.api.authLogin(this.username.toLowerCase(), this.password)
		.then(val => {
			if(val['error']) {
				loader.dismiss();

				this.alertCtrl.create({
					title: 'Gagal Masuk!',
					subTitle: 'Pastikan Username dan Password Benar!',
					buttons: [
	    				{
	    					text: 'OK',
	    					handler: data => {
	    						this.username = '',
	    						this.password = ''
	    					}
	    				}
					]
				}).present();
			} else {

				this.storage.set('login_profile', val);
				this.storage.set('login_status', 'loggined');
				
				this.nav.setRoot(TabsPage);

				loader.dismiss();

				this.toast.create({
					message: 'Berhasil Masuk!',
					duration: 3000,
					position: 'top'
				}).present();
			}
		}, err => {
			loader.dismiss();
			this.alertCtrl.create({
				title: 'Koneksi bermasalah!',
				message: 'Priksa kembali Koneksi Internet Anda!',
				buttons: [{
					text: 'OK',
					handler: data => {
						console.log(data);
					}
				}]
			}).present();
			console.log('error login : ' + err);
		});
	}

	goToShowPassword() {
		if (this.matanbm) {
			this.matanbm = false;
		} else {
			this.matanbm = true;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MasukPage');
	}

}
