import { Container } from '@material-ui/core';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

export const FormContainer = styled(Container)`
    margin-top: 30px;
    padding: 20px;
    & > h2 {
        margin-top: 0;
        margin-bottom: 0.9rem;
    };
    & > form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        & button{
            width: 108px;
            margin-top: 10px;
        }
    }


`

export const StyledButton = styled(Button)`
    margin-top: 25px;
    width: 100%;
    background-color: black;
    color: white;
    & :hover{
        color: black;
        font-weight: bold;
    }

`