import { Test } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import * as pactum from "pactum"
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: DbService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    )
    await app.init();
    await app.listen(3333)

    prisma = app.get(DbService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl("http://localhost:3333")
  });
  afterAll(() => app.close())
  it.todo('should pass')

  describe('Auth', () => {

    const dto: AuthDto = {
      email: "john@gmail.com",
      password: "john123@"
    }

    describe('Signup', () => {

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      });


      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
      });


      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      });

    })

    describe('SignIn', () => {

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      });


      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400)
      });


      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('token', 'access_token')
      });


    })


  })
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200)
      });
    })


    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: "Eve",
        email: "eve@gmail.com"
      }
      it('should edit current user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      });
    })


  })
  describe('Bookmarks', () => {

    describe('Get empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200)
          .expectBody([])
      });

    })

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: "Google.com",
        link: "www.google.com",
        description: "a basic web page for the google search engine"
      }
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .withBody(dto)
          .expectStatus(201)
      });
    })


    describe('Get bookmark', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200)
          .stores('bookmarkId', '[0].id')
      });
    })


    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200)
      });

    })


    describe('Edit bookmark by id', () => {
      const dto : EditBookmarkDto = {
        title : "Youtube",
        link : "www.youtube.com",
        description : "A youtbe video home "
      }
      it('should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200)
      });
    })



    describe('Delete bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(204)
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200)
          .expectBody([])
      });
    })


  })
})
