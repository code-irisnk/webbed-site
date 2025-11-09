import { Component } from '@angular/core';

@Component({
    selector: 'app-ssh',
    templateUrl: './ssh.component.html',
    styleUrls: ['./ssh.component.scss'],
})
export class SshComponent {
    sshKeys = [
        {
            name: 'ruthenium',
            key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEobdwiNw95e/JdgyGbWCqxNBU0uBFchjt5T+3P0LBhN',
            comment: 'irisnk@ruthenium',
        },
        {
            name: 'ektron',
            key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILjPSOsni9cZ8MJNZI9QE8AAYe5W7KvV35MWEmbdxcM3',
            comment: 'irisnk@ektron',
        },
        {
            name: 'dionysus',
            key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFMZnMGAjr3WbNkvk0aeeWJBnXAoS8pk5TaS1LZtjGNP',
            comment: 'u0_a370@localhost',
        },
        {
            name: 'PGP',
            key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG4ztjl0IHF83b4YcqMNxK/JBxTOggnzBJ5g2yQpCbM+',
            comment: 'openpgp:0xDB3D4BFC',
        },
        {
            name: 'Yubikey',
            key: 'sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29tAAAAIMusIxvnxnzAK27iThvDT7gYfDn/V6cNbqHq7xQ2ejkeAAAACHNzaDp5dWJp',
            comment: 'irisnk@yubikey',
        },
    ];

    copiedKey: string | null = null;

    copyToClipboard(text: string, name: string): void {
        navigator.clipboard.writeText(text).then(() => {
            this.copiedKey = name;
            setTimeout(() => {
                this.copiedKey = null;
            }, 2000);
        });
    }
}
