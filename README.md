# ripe-banana

## Models/Relationships

- films
  - id
  - title
  - released (4-digit year)
  - fk studio
- studios
  - id
  - name
  - city
  - country
- actors
  - id
  - name
  - dob (date of birth)
  - pob (place of birth)
- casts
  - id
  - role
  - fk film
  - fk actor
- users (aka reviewers)
  - id
  - username
- reviews
  - rating (1-5)
  - review
  - fk film
  - fk user (reviewer)

## API

### `/films`

#### `GET /`

- film (id, name, released)
  - studio (id, name)
  - review count and avg (rating)
- accept optional query that applies to film `title = '%criteria%'`
- sort ASC on title

auth: public

#### `GET /top`

- film (id, name, released)
  - studio (id, name)
  - review count and avg (rating)
- sort DESC on avg rating
- limit to 20

auth: public

#### `GET /:id`

- film (id, title, released)
  - studio (id, name, city, country)
  - cast (role), actor (name)
  - reviews (id, rating, review)
    - reviewer/user (id, username)

auth: public

#### `POST /`

- film (title, released, studio id)

auth: admin

#### `POST /:id/cast`

- cast (role, film id (from param), actor id)

auth: admin

#### `POST /:id/reviews`

review (rating, review, film id (from param), reviewer id (authed user))

auth: user

### `/studios`

#### `POST /`

- studio (name, city, country)

auth: admin

#### `GET /:id`

- studio (name, city, country)
  - films (title, released)
- (sort on studio name)

auth: public

### `/actors`

#### `POST /`

- actor (name, dob, pob)

auth: admin

#### `GET /:id`

- actor (id, name, dob, pob)
  - cast/films (role/title, released)

auth: public

### `/reviewers`

#### `POST /`

NOTE: could be users table instead, would be populated via auth/profile

reviewer (name)

auth: admin/signup
