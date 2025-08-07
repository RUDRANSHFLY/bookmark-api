import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorators';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(AuthGuard)
@Controller('bookmark')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }

    @Post()
    createBookmark(
        @GetUser('sub') userId: string,
        @Body() dto: CreateBookmarkDto,
    ) {
        return this.bookmarkService.createBookmark(userId,dto);
    }

    @Get()
    getBookmarks(
        @GetUser('sub') userId: string,
    ) {
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(':id')
    getBookmarkById(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId: string,
    ) {
        return this.bookmarkService.getBookmarkById(userId,bookmarkId)
    }

    @Patch(':id')
    editBookmarkById(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId: string,
        @Body() dto: EditBookmarkDto,
    ) {
        return this.bookmarkService.editBookmarkById(userId,bookmarkId,dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId : string
    ) {
        return this.bookmarkService.deleteBookmarkById(userId,bookmarkId)
    }
}
