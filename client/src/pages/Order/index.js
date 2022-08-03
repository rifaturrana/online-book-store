import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
} from "@material-ui/core";
import { PayPalButton } from "react-paypal-button-v2";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from "../../actions/orderActions";
import Loader from "../../components/Loader/Loader";
import {
  Message,
  OrderItem,
  ShippingMessage,
  SummaryItem,
  StyledLink,
} from "./Order.elements";
import axios from "axios";
import types from "../../actions/types";
import Meta from "../../components/Meta";
import { clearCart } from "../../actions/cartActions";

const Order = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const currentUser = useSelector((state) => state.currentUser);
  const { userInfo } = currentUser;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay } = orderPay;
  console.log(orderPay);

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successDeliver } = orderDeliver;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo || !userInfo.name) {
      history.push("/login");
    }
    dispatch({ type: types.ORDER_CREATE_RESET });
    // const addPayPalScript = async () => {
    //   const { data: clientId } = await axios.get("/api/config/paypal");
    //   const script = document.createElement("script");

    //   script.type = "text/javascript";
    //   script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    //   script.async = true;
    //   script.addEventListener("load", () => {
    //     setSdkReady(true);
    //   });
    //   document.body.appendChild(script);
    // };

    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: types.ORDER_PAY_RESET });
      dispatch({ type: types.ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
      dispatch(clearCart());
    }
    // } else if (!order.isPaid) {
    //   if (!window.paypal) {
    //     addPayPalScript();
    //   } else {
    //     setSdkReady(true);
    //   }
    // }
  }, [history, userInfo, order, orderId, successPay, successDeliver, dispatch]);

  const successPaymentHandler = async () => {
    dispatch(payOrder(orderId));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(orderId));
  };
  console.log(orderDetails);
  return (
    <div className="order-page">
      <Meta title="Your Order | Book Attic" />
      <Container maxWidth={"lg"}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <h2>{`ORDER NO. ${order._id}`}</h2>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <h3>SHIPPING</h3>
                <p>
                  <strong>Name: </strong>
                  {`${order.user.name}`}
                </p>
                <p>
                  <strong>Email: </strong>
                  {`${order.user.email}`}
                </p>
                <p>
                  <strong>Address: </strong>
                  {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode} ${order.shippingAddress.country}`}
                </p>
                <Message>
                  {order.isDelivered ? (
                    <Alert severity="success">
                      Delivered on {order.deliveredAt}
                    </Alert>
                  ) : (
                    <Alert severity="error">Not Delivered Yet</Alert>
                  )}
                </Message>
                <Divider />
                <h3>PAYMENT</h3>
                <p>
                  <strong>Method: Bkash </strong>
                </p>
                <Message>
                  {order.isPaid ? (
                    <Alert severity="success">
                      Paid on {order.paidAt.slice(0, 10)}
                    </Alert>
                  ) : (
                    <Alert severity="error">Not Paid</Alert>
                  )}
                </Message>
                <Divider />
                <h3>Order Items</h3>
                {order.orderItems.length === 0 ? (
                  <Alert>No Items to Display</Alert>
                ) : (
                  order.orderItems.map((item) => (
                    <div key={item._id}>
                      <OrderItem>
                        <img
                          style={{ width: "50px" }}
                          src={item.image}
                          alt={item.name}
                        />
                        <p>{item.name}</p>
                        <p>{`${item.qty} x ${item.price} = ${
                          item.qty * item.price
                        }`}</p>
                      </OrderItem>
                      <Divider />
                    </div>
                  ))
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Container>
                  <Card>
                    <CardContent>
                      <h3>ORDER SUMMARY</h3>
                      <Divider />
                      <SummaryItem>
                        Items:{" "}
                        <strong>
                          TK{" "}
                          {order.orderItems
                            .reduce(
                              (acc, item) => acc + item.price * item.qty,
                              0
                            )
                            .toFixed(2)}
                        </strong>
                      </SummaryItem>
                      <SummaryItem>
                        Shipping: <strong>TK {order.shippingPrice}</strong>
                      </SummaryItem>
                      <SummaryItem>
                        Total: <strong>TK {order.totalPrice}</strong>
                      </SummaryItem>
                      <ShippingMessage>
                        (Orders above TK 50 have free shipping)
                      </ShippingMessage>
                    </CardContent>

                    {!userInfo.isAdmin && !order.isPaid && (
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={successPaymentHandler}
                        >
                          Pay via Bkash
                        </Button>
                      </div>
                    )}
                    {!userInfo.isAdmin && order.isPaid && (
                      <StyledLink to="/">
                        <Button variant="contained" color="primary">
                          Continue Shopping
                        </Button>
                      </StyledLink>
                    )}
                    {userInfo &&
                      userInfo.isAdmin &&
                      order.isPaid &&
                      !order.isDelivered && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={deliverHandler}
                        >
                          Mark As Delivered
                        </Button>
                      )}
                  </Card>
                </Container>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default Order;
