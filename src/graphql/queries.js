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

export const TOTAL_SPOTS = gql`
    query {
        totalSpots
    }
`;

export const ALL_SPOTS = gql`
    query allSpots($input: Int!) {
        allSpots(input: $input) {
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

export const SEARCH_SPOTS = gql`
    query searchSpots($input: SearchSpotsInput) {
        searchSpots(input: $input) {
            spots {
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
            page
            numberOfPages
        }
    }
`;



//COMMENT QUERIES
export const GET_COMMENTS = gql`
query getComments($input: GetCommentsInput) {
    getComments(input: $input) {
        page
        numberOfPages
        comments {
            spotSlug
            commentedBy {
                _id
                username
            }
            createdAt
            image {
                public_id
                url
            }
            content
            _id
        }
    }
}
`;