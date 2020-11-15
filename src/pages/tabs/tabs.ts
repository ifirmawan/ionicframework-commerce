import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BerandaPage } from '../beranda/beranda';
import { KategoriPage } from '../kategori/kategori';
import { KeranjangPage } from '../keranjang/keranjang';
import { TokoPage } from '../toko/toko';
import { SalesPage } from '../sales/sales';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

	arpesanan: any = 2;
	
	tab1Root = BerandaPage;
	tab2Root = KategoriPage;
	tab3Root = KeranjangPage;
	tab4Root = TokoPage;
	tab5Root = SalesPage;

	constructor(public events: Events, private storage: Storage) {

		this.initIalisation();
	}

	getCountKeranjang() {
		this.storage.get('cart_nbm').then(val => {
			if (val) {
				this.arpesanan = val.length;
			} else {
				this.arpesanan = '';
			}
		})
	}

	initIalisation()
	{
		this.events.subscribe('cart:update', (count) => {
	    // user and time are the same arguments passed in `events.publish(user, time)`
	    	if(count == 0) {
	    		this.arpesanan = '';
	    	} else {
	    		this.arpesanan = count;
	    	}
	    	console.log(count);
	  });
	}

	ionViewDidLoad() {
		this.getCountKeranjang();
	}
}