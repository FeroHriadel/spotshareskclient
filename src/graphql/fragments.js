import { gql } from 'apollo-boost';



//USER FRAGMENTS
export const USER_INFO = gql`
    fragment userInfo on User {
        _id
        username
        email
        about
        image {
            url
            public_id
        }
        createdAt
        updatedAt
    }
`;



//CATEGORY FRAGMENTS
export const CATEGORY_INFO = gql`
    fragment categoryInfo on Category {
        _id
        name
        slug
        about
        createdAt
        updatedAt
    }
`;



//TAG FRAGMENTS
export const TAG_INFO = gql`
    fragment tagInfo on Tag {
        _id
        name
        slug
        image {
            url
            public_id
        }
        createdAt
        updatedAt
    }
`;