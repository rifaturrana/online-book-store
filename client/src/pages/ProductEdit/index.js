import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Alert } from '@material-ui/lab';
import { Button, CircularProgress, Container, Input, InputLabel, MenuItem, Paper, Select, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, updateProductAdmin } from '../../actions/productActions'
import { FormContainer, StyledLink } from './ProductEdit.elements'
import types from '../../actions/types';
import Meta from '../../components/Meta';

const ProductEdit = ({match, history}) => {

    const productId = match.params.id;
 
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [author, setAuthor] = useState('');
    const [publication, setPublication] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [uploading, setUploading] = useState(false);

    


    const dispatch = useDispatch();
    
    const currentProduct = useSelector(state => state.currentProduct);
    const {loading, error, product } = currentProduct;

    const currentUser = useSelector(state => state.currentUser);
    const { userInfo } = currentUser;

    const updateProduct = useSelector(state => state.updateProduct);
    const { error: updateError, success: updateSuccess } = updateProduct;


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProductAdmin({
            _id: productId,
            name,
            price,
            image,
            author,
            publication,
            countInStock,
            category,
            description
        }))
    }
    
    const uploadImageHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/upload', formData, config);

            setImage(data)
            setUploading(false)
        } catch(err) {
            console.log(err);
            setUploading(false);
        }
    }
    useEffect(() => { 
        if(!userInfo){
            history.push('/login') 
        }else{
            if(updateSuccess){
                dispatch({type: types.PRODUCT_UPDATE_RESET});
                history.push('/admin/productList/page/1')
            }else{
                if(!product.name || product._id !== productId){
                    dispatch(fetchProduct(productId))
                } else {
                    setName(product.name);
                    setPrice(product.price);
                    setImage(product.image);
                    setAuthor(product.author);
                    setPublication(product.publication);
                    setCategory(product.category);
                    setCountInStock(product.countInStock);
                    setDescription(product.description);
                }
            }
        }
        //eslint-disable-next-line
    }, [history, userInfo, product._id, dispatch,updateSuccess])


    return (
        <div className='productedit-page'>
            <Meta title="Product Edit | Book Attic" />
            <Container maxWidth={'lg'}>
                <StyledLink to='/admin/productlist'>Go Back</StyledLink>
                {updateError && <Alert severity='error'>{updateError}</Alert>}
                {updateSuccess && <Alert severity='success'>Updated Successfully</Alert>
                }
                <FormContainer component={Paper} justify='left' maxWidth='xs'>
                        <h2>Edit Product</h2>
                        {error && <Alert severity='error'>{error}</Alert>}
                        {loading && <Alert severity='info'>{'Updating...'}</Alert>}
                        <form onSubmit={submitHandler}>
                        <TextField 
                            required 
                            margin='dense'
                            fullWidth label="Name" 
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <TextField 
                            required 
                            margin='dense'
                            fullWidth label="Author" 
                            value={author}
                            onChange={(e)=>setAuthor(e.target.value)}
                        />
                        <TextField 
                            required
                            type='number'
                            margin='dense'
                            fullWidth label="Price" 
                            value={price}
                            onChange={(e)=>setPrice(e.target.value)}
                        />
                        <TextField 
                            required 
                            margin='dense'
                            fullWidth label="Image" 
                            value={image}
                            onChange={(e)=>setImage(e.target.value)}
                        />
                        <Input
                        fullWidth
                        type='file' 
                        onChange={uploadImageHandler}
                        />
                        {uploading && <CircularProgress />}
                        <TextField 
                            required 
                            margin='dense'
                            fullWidth label="Publication" 
                            value={publication}
                            onChange={(e)=>setPublication(e.target.value)}
                        />
                        <InputLabel id="select-genre">Genre</InputLabel>
                        <Select
                            labelId="select-genre"
                            required
                            value={category}
                            onChange={(e)=>setCategory(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value={'thriller'}>Thriller</MenuItem>
                            <MenuItem value={'romance'}>Romance</MenuItem>
                            <MenuItem value={'young-adult'}>Young Adult</MenuItem>
                            <MenuItem value={'science-fiction'}>Science Fiction</MenuItem>
                            <MenuItem value={'fantasy'}>Fantasy</MenuItem>
                            <MenuItem value={'poetry'}>Poetry</MenuItem>
                            <MenuItem value={'biography'}>Biography</MenuItem>
                            <MenuItem value={'self-help'}>Self Help</MenuItem>
                        </Select>
                        <TextField 
                            required 
                            margin='dense'
                            type='number'
                            fullWidth label="Stock" 
                            value={countInStock}
                            onChange={(e)=>setCountInStock(e.target.value)}
                        />
                        <TextField 
                            required 
                            margin='dense'
                            fullWidth label="Description" 
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                        />
                        <Button color='primary' variant='contained' type='submit'>Update Product</Button>
                    </form>
                </FormContainer>
            </Container>
        </div>
    )
}

export default ProductEdit;
