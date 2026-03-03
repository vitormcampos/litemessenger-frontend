import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
    selector: 'app-chat',
    imports: [],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
})
export class ChatComponent {
    private readonly route = inject(ActivatedRoute);

    chatId = toSignal(
        this.route.paramMap.pipe(map((params) => params.get('id')!))
    );
}
