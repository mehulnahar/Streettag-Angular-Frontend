import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationPipe} from './pagination/pagination.pipe';
import { ProfilePicturePipe } from './profilePicture/profilePicture.pipe';
import { ChatPersonSearchPipe } from './search/chat-person-search.pipe';
import { UserSearchPipe } from './search/user-search.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';
import { MailSearchPipe } from './search/mail-search.pipe';
import { DecodePipe } from './decode/decode.pipe';
import { ImagePipe } from './image/image.pipe';
import { IncreasePipe } from './increase/increase.pipe';
import { ValidurlPipe } from './validurl/validurl.pipe';
import { FloatPipe } from './float.pipe';
import { SerialNumberPipe } from './serialNumber/serial-number.pipe';

@NgModule({
    imports: [ 
        CommonModule 
    ],
    declarations: [
        PaginationPipe,
        ProfilePicturePipe,
        ChatPersonSearchPipe,
        UserSearchPipe,
        TruncatePipe,
        MailSearchPipe,
        DecodePipe,
        ImagePipe,
        IncreasePipe,
        ValidurlPipe,
        FloatPipe,
        SerialNumberPipe
    ],
    exports: [
        PaginationPipe,
        ProfilePicturePipe,
        ChatPersonSearchPipe,
        UserSearchPipe,
        TruncatePipe,
        MailSearchPipe,
        DecodePipe,
        ImagePipe,
        IncreasePipe,
        ValidurlPipe,
        FloatPipe,
        SerialNumberPipe
    ]
})
export class PipesModule { }
