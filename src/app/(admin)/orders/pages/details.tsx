import { useEffect, useState } from 'react'
import { Card, CardBody, CardTitle, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

import { getInvoiceById } from '@/helpers/data'
import { currency } from '@/context/constants'
import PageMetaData from '@/components/PageTitle'
import type { InvoiceType } from '@/types/data'

import logoDark from '@/assets/images/logo-dark-full.png'
import logoLight from '@/assets/images/logo-light-full.png'
import { useGetOrderDetails, useUpdateOrder } from '../orders.hooks'

const OrderDetails = () => {
    const [invoice, setInvoice] = useState<InvoiceType>()
    const { orderId } = useParams()
    const navigate = useNavigate()

    const { data: order, isError, isLoading, refetch, isRefetching } = useGetOrderDetails(orderId || "")

    const updateOrder = useUpdateOrder();



    useEffect(() => {
        // ;(async () => {
        //   if (orderId) {
        //     const data = await getInvoiceById(orderId)
        //     if (data) setInvoice(data)
        //     else navigate('/pages/error-404-alt')
        //   }
        // })()
    }, [])

    return (
        <>
            <PageMetaData title={order?.orderNumber ?? 'تفاصيل الطلب'} />

            {
                isLoading || isRefetching  && <div className="text-center" style={{
                    
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: "50%",
                    zIndex: 111
                }}>
                    <Spinner animation="border" />
                </div >
            }

            <Row>

                <Col xs={12}>


                    {order && !isError && (
                        <Card>
                            <CardBody>
                                <div className="clearfix">
                                    <div className="float-sm-end">
                                        <CardTitle as={'h5'} className="mb-2">
                                            رقم الطلب: #{order.orderNumber}
                                        </CardTitle>

                                        <address className="mt-3">
                                            {order.shippingAddress.deliveryAddress}
                                            <br />
                                            {order.shippingAddress.location.displayName} <br />
                                            <abbr>رقم الهاتف : </abbr> {order.shippingAddress.phone}

                                        </address>

                                    </div>
                                    <div className="float-sm-start">

                                        <Form.Select onChange={(e) => {
                                            console.log("changed", e.target.value);
                                            updateOrder.mutate({
                                                id: order.id || "",
                                                order: { status: e.target.value }
                                            }, {
                                                onSuccess: () => {
                                                    refetch();
                                                    //navigate("/groups")
                                                }, onError: (error) => {
                                                    //setServerError(error.message || "Unknown error")
                                                }
                                            });

                                        }} aria-label="Default select example">
                                            <option value="">حالة الطلب</option>
                                            <option selected={order.status === "pending"} value="pending">قيد الانتظار</option>
                                            <option selected={order.status === "awaiting_payment"} value="awaiting_payment">في انتظار الدفع</option>
                                            <option selected={order.status === "payment_failed"} value="payment_failed">فشل الدفع</option>
                                            <option selected={order.status === "processing"} value="processing">جاري المعالجة</option>
                                            <option selected={order.status === "on_hold"} value="on_hold">معلّق</option>
                                            <option selected={order.status === "shipped"} value="shipped">تم الشحن</option>
                                            <option selected={order.status === "out_for_delivery"} value="out_for_delivery">خرج للتوصيل</option>
                                            <option selected={order.status === "delivered"} value="delivered">تم التوصيل</option>
                                            <option selected={order.status === "completed"} value="completed">مكتمل</option>
                                            <option selected={order.status === "cancelled"} value="cancelled">ملغي</option>
                                            <option selected={order.status === "failed"} value="failed">فشل</option>
                                            <option selected={order.status === "returned"} value="returned">مرتجع</option>
                                            <option selected={order.status === "refunded"} value="refunded">تم رد المبلغ</option>
                                            <option selected={order.status === "partially_shipped"} value="partially_shipped">تم الشحن جزئيًا</option>
                                            <option selected={order.status === "partially_refunded"} value="partially_refunded">تم رد جزء من المبلغ</option>
                                            <option selected={order.status === "ready_for_pickup"} value="ready_for_pickup">جاهز للاستلام</option>
                                            <option selected={order.status === "rescheduled"} value="rescheduled">تم إعادة الجدولة</option>
                                            <option selected={order.status === "expired"} value="expired">منتهي الصلاحية</option>
                                        </Form.Select>


                                    </div>
                                </div>
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <h6 className="fw-normal text-muted">إسم العميل</h6>
                                        <h6 className="fs-16">{`${order.user.firstName} ${order.user.lastName}`}</h6>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <div className="table-responsive table-borderless text-nowrap mt-3 table-centered">
                                            <table className="table mb-0">
                                                <thead className="bg-light bg-opacity-50">
                                                    <tr>
                                                        <th className="border-0 py-2">إسم المنتج</th>
                                                        <th className="border-0 py-2">الكمية</th>
                                                        <th className="border-0 py-2">السعر</th>
                                                        <th className="text-end border-0 py-2">الكل</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {order.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.product.name.ar}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.unitPrice.toFixed(2)} {currency}</td>
                                                            <td className="text-end">{(item.unitPrice * item.quantity).toFixed(2)} {currency}</td>
                                                            {/* 
                                                           */}
                                                        </tr>
                                                    ))}

                                                    {/* <tr>
                                                        <td>G15 Gaming Laptop</td>
                                                        <td>3</td>
                                                        <td>{currency}240.59</td>
                                                        <td className="text-end">{currency}721.77</td>
                                                    </tr>
                                                
                                                    */}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    {/* <Col sm={7}>
                                        <div className="clearfix pt-xl-3 pt-0">
                                            <h6 className="text-muted">Notes:</h6>
                                            <small className="text-muted">
                                                All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment
                                                online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged
                                                the agreed quoted fee noted above.
                                            </small>
                                        </div>
                                    </Col> */}
                                    <Col sm={5}>
                                        <div className="float-end">
                                            <p>
                                                <span className="float-end">المجموع الجزئي : </span>
                                                <span className="fw-medium">
                                                    {order.totalPrice} {currency}
                                                </span>

                                            </p>
                                            <p>
                                                <span className="float-end"> التوصيل : </span>
                                                <span className="fw-medium">
                                                    {order?.shippingCost} {currency}
                                                </span>

                                            </p>
                                            {order?.discount &&
                                                <p>
                                                    <span className="fw-medium">الخصم</span>
                                                    <span className="float-end">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                        {order?.discount?.value}
                                                    </span>
                                                </p>
                                            }
                                            <h3>
                                                الإجمالي :
                                                {order?.finalPrice} {currency} </h3>
                                        </div>
                                        <div className="clearfix" />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    )}
                </Col>
            </Row>
        </>
    )
}

export default OrderDetails
