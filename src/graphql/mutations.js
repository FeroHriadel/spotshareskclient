import { gql } from 'apollo-boost';
import { USER_INFO, TAG_INFO } from './fragments';



//USER MUTATIONS
export const USER_CREATE = gql`
    mutation userCreate {
        userCreate {
            username
            email
            role
        }
    }
`;

export const USER_UPDATE = gql`
    mutation userUpdate($input: UserUpdateInput!) {
        userUpdate(input: $input) {
            ...userInfo
        }
    }
    ${USER_INFO}
`;



//CATEGORY MUTATIONS
export const CATEGORY_CREATE = gql`
    mutation categoryCreate($input: CategoryCreateInput!) {
        categoryCreate(input: $input) {
            name
            slug
            about
        }
    }
`;

export const CATEGORY_DELETE = gql`
    mutation categoryDelete($input: CategoryDeleteInput!) {
        categoryDelete(input: $input) {
            name
            slug
            about
        }
    }
`;

export const CATEGORY_UPDATE = gql`
    mutation categoryUpdate($input: CategoryUpdateInput!) {
        categoryUpdate(input: $input) {
            name
            about
            slug
        }
    }
`;



//TAG MUTATIONS
export const TAG_CREATE = gql`
    mutation tagCreate($input: TagCreateInput!) {
        tagCreate(input: $input) {
            name
            slug
            image {
                url
                public_id
            }
            _id
            createdAt
            updatedAt
        }
    }
`; //stopped using fragments => graphql was complaining about some union and I dunno what

export const TAG_DELETE = gql`
    mutation tagDelete($input: TagDeleteInput!) {
        tagDelete(input: $input) {
            name
            slug
            image {
                url
                public_id
            }
            _id
            createdAt
            updatedAt
        }
    }
`;

export const TAG_UPDATE = gql`
    mutation tagUpdate($input: TagUpdateInput!) {
        tagUpdate(input: $input) {
            name
            slug
            image {
                url
                public_id
            }
            _id
            createdAt
            updatedAt
        }
    }
`;



//SPOT MUTATIONS
export const SPOT_CREATE = gql`
    mutation spotCreate($input: SpotCreateInput!) {
        spotCreate(input: $input) {
            name
            slug
            where
            highlight
            description
            category
            tags
            lat
            long
            postedBy
            _id
            createdAt
        }
    }
`;

export const SPOT_EDIT = gql`
  mutation spotEdit($input: spotEditInput!) {
      spotEdit(input: $input) {
          name
          slug
          where
          highlight
          description
          category
          tags
          lat
          long
          postedBy
          _id
          createdAt
      }
  }  
`;

export const SPOT_DELETE = gql`
  mutation spotDelete($input: spotDeleteInput!) {
      spotDelete(input: $input) {
        _id
        slug
        name
        postedBy
    }
  }
`;



export const SPOT_LIKE = gql`
  mutation spotLike($input: SpotLikeInput!) {
      spotLike(input: $input) {
        name
        slug
        images {
            url
            public_id
        }
        where
        highlight
        description
        category {
            name
            _id
        }
        tags {
            image {
                url
                public_id
            }
            name
            _id
        }
        lat
        long
        postedBy
        username
        createdAt
        updatedAt
        likes
    }
  }
`;