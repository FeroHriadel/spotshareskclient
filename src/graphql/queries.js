import { USER_INFO, CATEGORY_INFO, TAG_INFO } from './fragments';
import { gql } from 'apollo-boost';



//USER QUERIES
export const PROFILE = gql`
    query {
        profile {
            ...userInfo
        }
    }
    ${USER_INFO}
`;



//CATEGORY QUERIES
export const ALL_CATEGORIES = gql`
    query {
        allCategories {
            ...categoryInfo
        }
    }
    ${CATEGORY_INFO}
`;

export const GET_CATEGORY = gql`
    query getCategory($slug: String!) {
        getCategory(slug: $slug) {
            ...categoryInfo
        }
    }
    ${CATEGORY_INFO}
`;



//TAG QUERIES
export const ALL_TAGS = gql`
    query {
        allTags {
            ...tagInfo
        }
    }
    ${TAG_INFO}
`;

export const GET_TAG = gql`
    query getTag($slug: String!) {
        getTag(slug: $slug) {
            ...tagInfo
        }
    }
    ${TAG_INFO}
`;



//SPOT QUERIES
export const GET_SPOT = gql`
    query getSpot($slug: String!) {
        getSpot(slug: $slug) {
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
            }
            tags {
                image {
                    url
                }
                name
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
