import React, { useEffect, useRef } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { Container, Grid } from '@material-ui/core';
import Product from '../../components/Product';
import Loader from '../../components/Loader/Loader';
import {fetchProductsList} from '../../actions/productActions';
import { Alert, Pagination } from '@material-ui/lab';
import { PaginationContainer, TopRated } from './Home.elements';
import HomeMain from '../../components/HomeMain';
import GenreSelector from '../../components/GenreSelector';
import Meta from '../../components/Meta';
import {gsap, TweenMax, Power3} from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);



function HomePage({match, history}) {

    const pageNumber = Number(match.params.page) || 1;

    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList)
    const{loading, error, products, page, totalPages} = productList

    const gridRef = useRef(null);
    const headingRef = useRef(null);

    useEffect(()=>{
        dispatch(fetchProductsList(pageNumber));
    }, [dispatch, pageNumber])

    const handlePagination = (e, v) => {
        TweenMax.to(window,  0.3, {scrollTo: headingRef.current.offsetTop, ease: Power3.easeOut} )
        history.push(`/page/${v}`)
        
    }

    return (
        <div className='home-page'>
            <Meta title="Book Attic | Buy books online" />
            <HomeMain />
            <Container maxWidth={'lg'}>
                <GenreSelector />
                <TopRated>
                    <h1 ref={headingRef}>Top Rated Books</h1>
                    {loading ? <div style={{height:gridRef.current.offsetHeight + 60, width:gridRef.current.offsetWidth, display: 'grid', placeItems: 'center'}}></div> : 
                        error ? <Alert severity="error">{error}</Alert>:
                        <>
                            <Grid ref={gridRef} container spacing={3} justify={'center'} alignContent={'center'} alignItems={'center'}>
                                {products.map( (product) => (
                                    <Product key={product._id}product={product}/>
                                ))}
                            </Grid>
                            <PaginationContainer>
                                <Pagination 
                                count={totalPages} 
                                page={page} 
                                onChange={handlePagination}
                                size='large'
                                color='primary'
                                />
                            </PaginationContainer>
                        </>
                    }
                </TopRated>
            </Container>
        </div>
    )
};

export default HomePage;
