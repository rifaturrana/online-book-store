import types from './types';
import axios from 'axios';

export const fetchProductsList = (page = '') => async(dispatch) => {
    try {
        dispatch({type: types.FETCH_PRODUCTSLIST_REQUEST})

        const {data} = await axios.get(`/api/products?page=${page}`);
        
        dispatch({
            type: types.FETCH_PRODUCTSLIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: types.FETCH_PRODUCTSLIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
};


export const fetchProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type:types.FETCH_PRODUCT_REQUEST })

        const {data} = await axios.get(`/api/products/${id}`);

        dispatch({
            type: types.FETCH_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: types.FETCH_PRODUCT_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const deleteProductAdmin = (id) => async(dispatch, getState) => {

    try {
        dispatch({ type: types.PRODUCT_DELETE_REQUEST });

        const {currentUser: {userInfo}} = getState();

        const config ={
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.delete(`/api/products/${id}`, config);

        dispatch({ type: types.PRODUCT_DELETE_SUCCESS });

    } catch (error) {
        dispatch({
            type: types.PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
};

export const createProductAdmin = () => async(dispatch, getState) => {

    try {
        dispatch({ type: types.PRODUCT_CREATE_REQUEST });

        const {currentUser: {userInfo}} = getState();

        const config ={
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(`/api/products`,{}, config);

        dispatch({ 
            type: types.PRODUCT_CREATE_SUCCESS,
            payload: data   
        });

    } catch (error) {
        dispatch({
            type: types.PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
};

export const updateProductAdmin = (product) => async(dispatch, getState) => {

    try {
        dispatch({ type: types.PRODUCT_UPDATE_REQUEST });

        const {currentUser: {userInfo}} = getState();

        const config ={
            headers: {
                'Cntent-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/products/${product._id}`,product, config);

        dispatch({ 
            type: types.PRODUCT_UPDATE_SUCCESS,
            payload: data   
        });

    } catch (error) {
        dispatch({
            type: types.PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
};

export const createProductReview = (productId, review) => async(dispatch, getState) => {

    try {
        dispatch({ type: types.PRODUCT_CREATE_REVIEW_REQUEST });

        const {currentUser: {userInfo}} = getState();

        const config ={
            headers: {
                'Cntent-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.post(`/api/products/${productId}/reviews`, review , config);

        dispatch({ 
            type: types.PRODUCT_CREATE_REVIEW_SUCCESS   
        });

    } catch (error) {
        dispatch({
            type: types.PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
};