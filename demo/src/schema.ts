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
  schema: builder,
  auto: [AutoColumn.ID, AutoColumn.CREATED_AT, AutoColumn.UPDATED_AT]
})
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
    maxLength: 100,
    protected: true
  })
  .build();

const posts = new TableBuilder({
  name: 'posts',
  schema: builder,
  auto: [AutoColumn.ID, AutoColumn.CREATED_AT, AutoColumn.UPDATED_AT]
})
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
    name: 'userId',
    type: ColumnType.INTEGER,
    reference: users
  })
  .column({
    name: 'metadata',
    type: ColumnType.CODE,
    allowNull: true
  })
  .build();

new TableBuilder({
  name: 'comments',
  schema: builder,
  auto: [AutoColumn.ID, AutoColumn.CREATED_AT, AutoColumn.UPDATED_AT]
})
  .searchColumn('content')
  .column({
    name: 'content',
    type: ColumnType.TEXT
  })
  .column({
    name: 'postId',
    type: ColumnType.INTEGER,
    reference: posts
  })
  .column({
    name: 'userId',
    type: ColumnType.INTEGER,
    reference: users
  })
  .build();

export const schema = builder.build();
