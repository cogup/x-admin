import {
  SchemaBuilder,
  TableBuilder,
  AutoColumn,
  ColumnType
} from '@cogup/fastapi';

const builder = new SchemaBuilder({
  auto: [AutoColumn.ID, AutoColumn.CREATED_AT, AutoColumn.UPDATED_AT]
});

const users = new TableBuilder({
  name: 'users',
  parent: builder,
  auto: [AutoColumn.ID, AutoColumn.CREATED_AT, AutoColumn.UPDATED_AT]
});

users
  .searchColumn('name')
  .column({
    name: 'name',
    type: ColumnType.STRING,
    maxLength: 100,
    unique: true
  })
  .column({
    name: 'email',
    type: ColumnType.STRING,
    maxLength: 100,
    unique: true
  })
  .column({
    name: 'password',
    type: ColumnType.STRING,
    maxLength: 100
  })
  .buildTable();

const authors = new TableBuilder({
  name: 'authors',
  parent: builder,
  auto: [AutoColumn.ID, AutoColumn.CREATED_AT, AutoColumn.UPDATED_AT]
});

authors
  .searchColumn('name')
  .column({
    name: 'name',
    type: ColumnType.STRING,
    maxLength: 100,
    unique: true
  })
  .column({
    name: 'user_id',
    type: ColumnType.INTEGER,
    reference: users.name
  })
  .buildTable();

const posts = new TableBuilder({
  name: 'posts',
  parent: builder,
  auto: [AutoColumn.ID, AutoColumn.CREATED_AT, AutoColumn.UPDATED_AT]
});

posts
  .searchColumn('title')
  .column({
    name: 'title',
    type: ColumnType.STRING,
    maxLength: 100,
    unique: true
  })
  .column({
    name: 'content',
    type: ColumnType.TEXT
  })
  .column({
    name: 'author_id',
    type: ColumnType.INTEGER,
    reference: authors.name
  })
  .buildTable();

const comments = new TableBuilder({
  name: 'comments',
  parent: builder,
  auto: [AutoColumn.ID, AutoColumn.CREATED_AT, AutoColumn.UPDATED_AT]
});

comments
  .searchColumn('content')
  .column({
    name: 'content',
    type: ColumnType.TEXT
  })
  .column({
    name: 'post_id',
    type: ColumnType.INTEGER,
    reference: posts.name
  })
  .column({
    name: 'user_id',
    type: ColumnType.INTEGER,
    reference: users.name
  })
  .buildTable();

export const schema = builder.build();
