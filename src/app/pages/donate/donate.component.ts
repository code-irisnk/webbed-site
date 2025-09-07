import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  imports: [NgFor]
})
export class DonateComponent {
  cryptoAddresses = [
    {
      coin: "ETH",
      address: "0x714fD48B751C83C5b19EC1a13d317AADd22C738c"
    },
    {
      coin: "BTC",
      address: "xpub6BjySddZ4QAuKyxdh62cjLLrHX2hJQfGeMtoKexqPAT8tA3PHRBZY6gA4G12fpMfr9ykAHyFQGfuvWS8gJSKP4SaDTCNK5rJQexBiZVvC7g"
    },
    {
      coin: "LTC",
      address: "xpub6DXC7wAjayV67pBUfZHYKsftjS974ecPR7vC9uz21S4wmDiTZErLgiGRi8JFLUY4wtGZpRsXJ2MfMRGy1E5mJxB6RzFVghBFpecnGqrWMEH"
    },
    {
      coin: "SOL",
      address: "5jyXqYd2TPa5H16gDBzcifUwT4x62vGjd2eRu3ccu2ho"
    },
    {
      coin: "DOGE",
      address: "xpub6BjySddZ4QAuKyxdh62cjLLrHX2hJQfGeMtoKexqPAT8tA3PHRBZY6gA4G12fpMfr9ykAHyFQGfuvWS8gJSKP4SaDTCNK5rJQexBiZVvC7g"
    }
  ];

  copiedCoin: string | null = null;

  copyToClipboard(text: string, coin: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedCoin = coin;
      setTimeout(() => {
        this.copiedCoin = null;
      }, 2000);
    });
  }
}
