import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import { abiContract, contractAddres } from './models/contract';

declare global {
  interface Window {
    ethereum:any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public account: any;
  public totalPrice: string = '';
  public ticketValue: string = '';
  public showBtn = true;

  private loteryContract: any;
  private web3!: Web3;
  private web3Provider!: any;
  private ticketPrice: number = 0;

  constructor(){}

  ngOnInit(): void {
    if (window.ethereum) {
      this.web3Provider = window.ethereum;
      
      window.ethereum.enable().then((account: any) => {

        this.web3 = new Web3(this.web3Provider);

        this.account = account;
        this.loteryContract = new this.web3.eth.Contract(abiContract, contractAddres);
        this.getPrizeData();
        this.getTicketValue();
      });
    }
  }

  getPrizeData() {
    this.loteryContract.methods.showPrize().call().then(({balance, totalBalance}: any) => {
      this.totalPrice = this.web3.utils.fromWei(balance, 'ether');
      console.log('totalBalance', totalBalance);
    });
  }

  getTicketValue() {
    this.loteryContract.methods.ticketValue().call().then((value: any) => {
      this.ticketValue = this.web3.utils.fromWei(value, 'ether');
      this.ticketPrice = value;
    });
  }

  goToContract() {
    window.open('https://rinkeby.etherscan.io/address/0xf951bb4a57ca11e5875ce11ddbfd05ba77ba0616', "_blank");
  }

  connectWallet() {
    window.ethereum.enable().then((a:any) => {
      this.account = a;
    });
  }

  playLotery() {
    this.showBtn = !this.showBtn;

    this.loteryContract.methods.play().
    send({ from: this.account[0], value: this.ticketPrice })
    .then(() => {
        this.showBtn = !this.showBtn;
    })
    .catch( (e:any) => { 
      this.showBtn = !this.showBtn;
      console.log('Error in transaction', e);
    });
  }
  
  // async getAccount() {
  //   const account = await this.a.request({ method: 'eth_requestAccounts' })
  //   console.log(account);
  //   this.account = account;
  // }
}
