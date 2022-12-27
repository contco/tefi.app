declare type Scalars = {
  ID: string;
  String: Scalars['String'];
  Boolean: boolean;
  Int: number;
  Float: number;
};

declare type DocumentProperties = {
  id: ID;
  text?: Scalars['String'];
  properties?: Array<Scalars['String']>;
};

declare type TaskDifficulty = {
  id: ID;
  member?: User;
  level?: Scalars['Int'];
};

declare type BlockProperties = {
  document?: Array<DocumentProperties>;
  priority?: Scalars['String'];
  assignee?: User;
  taskDifficulty?: Array<TaskDifficulty>;
  averageTaskDifficulty?: Scalars['Int'];
};

declare type BlockChildren = {
  children?: Array<Block>;
};

declare type Block = BlockChildren &
  BlockProperties & {
    __typename?: 'Block';
    id: ID;
    title?: Scalars['String'];
    type?: Scalars['String'];
    isCollapsed?: Scalars['Boolean'];
    order?: Scalars['Int'];
    emoji?: Scalars['String'];
    parentBlock?: Block;
    createdBy: User;
    members?: Array<User>;
  };

declare type User = {
  __typename?: 'User';
  userId: Scalars['String'];
  name?: Scalars['String'];
  picture?: Scalars['String'];
  role?: Scalars['String'];
  dob?: Scalars['String'];
  dashboard: Block;
  profile?: Block;
  createdBlocks?: Array<Block>;
};
